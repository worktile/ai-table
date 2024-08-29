import * as Y from 'yjs';
import * as Websocket from 'ws';
const syncProtocol = require('y-protocols/sync');
const awarenessProtocol = require('y-protocols/awareness');
import { IncomingMessage } from 'http';
import { ObservableV2 } from 'lib0/observable';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as map from 'lib0/map';
import { LiveFeedRoom } from '../feed-room';
import { messageYjsSyncStep1, readSyncMessage } from '../sync';

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

/**
 * @type {Map<string,WSSharedDoc>}
 */
export const docs = new Map();

const messageSync = 0;
const messageAwareness = 1;
// const messageAuth = 2

export class ServerLiveFeedRoom extends LiveFeedRoom {
    conns: Map<any, Set<any>> = new Map();
}

exports.ServerLiveFeedRoom = ServerLiveFeedRoom;

export const getRoom = (guid: string) => {
    return map.setIfUndefined(docs, guid, () => {
        const serverRoom = new ServerLiveFeedRoom({ guid, objects: [] });
        docs.set(guid, serverRoom);
        return serverRoom;
    });
};

const messageListener = (conn: Websocket, room: ServerLiveFeedRoom, message: Uint8Array) => {
    try {
        const encoder = encoding.createEncoder();
        const decoder = decoding.createDecoder(message);
        const messageType = decoding.readVarUint(decoder);
        switch (messageType) {
            case messageSync:
                encoding.writeVarUint(encoder, messageSync);
                const step1Ref: string[] = [];
                const syncMessageType = readSyncMessage(decoder, encoder, room, conn, step1Ref);

                // If the `encoder` only contains the type of reply message and no
                // message, there is no need to send the message. When `encoder` only
                // contains the type of reply, its length is 1.
                if (encoding.length(encoder) > 1) {
                    send(room, conn, encoding.toUint8Array(encoder));
                }
                if (syncMessageType === messageYjsSyncStep1 && step1Ref.length > 0) {
                    syncStep1(conn, room, step1Ref);
                }
                break;
        }
    } catch (err) {
        console.error(err);
        // @ts-ignore
        doc.emit('error', [err]);
    }
};

const syncStep1 = (conn: Websocket, room: ServerLiveFeedRoom, guids: string[]) => {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    encoding.writeVarUint(encoder, messageYjsSyncStep1);
    guids.forEach((guid: string) => {
        const object = room.getObject(guid);
        encoding.writeVarString(encoder, object.guid);
        const sv = Y.encodeStateVector(object);
        encoding.writeVarUint8Array(encoder, sv);
    });
    conn.send(encoding.toUint8Array(encoder));
};

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 */
const closeConn = (room: ServerLiveFeedRoom, conn: Websocket) => {
    if (room.conns.has(conn)) {
        room.conns.delete(conn);
    }
    conn.close();
};

/**
 * @param {WSSharedDoc} doc
 * @param {import('ws').WebSocket} conn
 * @param {Uint8Array} m
 */
const send = (room: ServerLiveFeedRoom, conn: Websocket, m: Uint8Array) => {
    if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
        closeConn(room, conn);
    }
    try {
        conn.send(m, {}, (err) => {
            err != null && closeConn(room, conn);
        });
    } catch (e) {
        closeConn(room, conn);
    }
};

const pingTimeout = 30000;

export const setupWSConnection = (
    conn: Websocket,
    req: IncomingMessage,
    { docName = (req.url || '').slice(1).split('?')[0], gc = true } = {}
) => {
    conn.binaryType = 'arraybuffer';
    // get doc, initialize if it does not exist yet
    const room = getRoom(docName);
    room.conns.set(conn, new Set());
    // listen and reply to events
    conn.on('message', /** @param {ArrayBuffer} message */ (message: ArrayBuffer) => messageListener(conn, room, new Uint8Array(message)));

    // Check if connection is still alive
    let pongReceived = true;
    const pingInterval = setInterval(() => {
        if (!pongReceived) {
            if (room.conns.has(conn)) {
                closeConn(room, conn);
            }
            clearInterval(pingInterval);
        } else if (room.conns.has(conn)) {
            pongReceived = false;
            try {
                conn.ping();
            } catch (e) {
                closeConn(room, conn);
                clearInterval(pingInterval);
            }
        }
    }, pingTimeout);
    conn.on('close', () => {
        closeConn(room, conn);
        clearInterval(pingInterval);
    });
    conn.on('pong', () => {
        pongReceived = true;
    });
    // 不主动发送 step1 ，因为不确定都有哪些文档需要同步，server 的文档数量和 client 端的有所不同
};
