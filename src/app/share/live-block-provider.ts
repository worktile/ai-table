/*
Unlike stated in the LICENSE file, it is not necessary to include the copyright notice and permission notice when you copy code from this file.
*/

/**
 * @module provider/websocket
 */

/* eslint-env browser */
import * as Y from 'yjs'; // eslint-disable-line
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as authProtocol from 'y-protocols/auth';
import * as awarenessProtocol from 'y-protocols/awareness';
import { Observable } from 'lib0/observable';

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageAuth = 2;

/**
 *                       encoder,          decoder,          provider,          emitSynced, messageType
 * @type {Array<function(encoding.Encoder, decoding.Decoder, WebsocketProvider, boolean,    number):void>}
 */
const messageHandlers = [];

messageHandlers[messageSync] = (encoder, decoder, provider: LiveBlockProvider, emitSynced, messageType) => {
    encoding.writeVarUint(encoder, messageSync);
    encoding.writeVarString(encoder, provider.doc.guid);
    const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, provider.doc, provider);
    if (emitSynced && syncMessageType === syncProtocol.messageYjsSyncStep2 && !provider.synced) {
        provider.synced = true;
    }
    return syncMessageType;
};

messageHandlers[messageQueryAwareness] = (encoder, decoder, provider, emitSynced, messageType) => {
    encoding.writeVarUint(encoder, messageAwareness);
    encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(provider.awareness, Array.from(provider.awareness.getStates().keys()))
    );
};

messageHandlers[messageAwareness] = (encoder, decoder, provider, emitSynced, messageType) => {
    awarenessProtocol.applyAwarenessUpdate(provider.awareness, decoding.readVarUint8Array(decoder), provider);
};

messageHandlers[messageAuth] = (encoder, decoder, provider, emitSynced, messageType) => {
    authProtocol.readAuthMessage(decoder, provider.doc, (doc, reason) => {
        permissionDeniedHandler(provider, reason);
    });
};

const permissionDeniedHandler = (provider: LiveBlockProvider, reason) => {
    console.warn(`Permission denied to access ${provider.doc.guid}.\n${reason}`);
};

const syncLiveBlock = (doc: Y.Doc, websocket) => {
    // always send sync step 1 when connected
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    encoding.writeVarString(encoder, doc.guid);
    syncProtocol.writeSyncStep1(encoder, doc);
    websocket.send(encoding.toUint8Array(encoder));
};

export class LiveBlockProvider extends Observable<string> {
    doc: Y.Doc;
    sharedType: Y.Array<any>;
    ws: WebSocket;
    #synced = false;

    constructor(guid: string, ws: WebSocket, doc?: Y.Doc) {
        super();
        if (doc) {
            this.doc = doc;
            this.sharedType = doc.getArray();
        } else {
            this.doc = new Y.Doc({ guid });
            this.sharedType = this.doc.getArray();
        }
        this.ws = ws;
        this.sharedType.observeDeep((events) => {
            this.emit('onChange', events);
        });
        this.doc.on('update', (update, origin) => {
            if (origin !== this) {
                const encoder = encoding.createEncoder();
                encoding.writeVarUint(encoder, messageSync);
                encoding.writeVarString(encoder, this.doc.guid);
                syncProtocol.writeUpdate(encoder, update);
            }
        });
    }

    sync() {
        syncLiveBlock(this.doc, this.ws);
    }

    readMessage(messageType: number, encoder: encoding.Encoder, decoder: decoding.Decoder) {
        const messageHandler = messageHandlers[messageType];
        if (messageHandler) {
            const result = messageHandler(encoder, decoder, this, true, messageType);
            // TODO: 只要是 step1 回复（yjs 给出的逻辑是，step1 并且有不同修改时回复）
            // 因为加了 guid 不好判定是否有不同修改，暂时全同步
            if (syncProtocol.messageYjsSyncStep1 === result) {
                this.ws.send(encoding.toUint8Array(encoder));
            }
        }
    }

    /**
     * @type {boolean}
     */
    get synced() {
        return this.#synced;
    }

    set synced(state) {
        if (this.#synced !== state) {
            this.#synced = state;
            this.emit('synced', [state]);
        }
    }
}
