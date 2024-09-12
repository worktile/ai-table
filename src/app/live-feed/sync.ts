import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as Y from 'yjs';
import { LiveFeedRoom } from './feed-room';

export const messageYjsSyncStep1 = 0;
export const messageYjsSyncStep2 = 1;
export const messageYjsUpdate = 2;

export const writeSyncStep2 = (decoder: decoding.Decoder, encoder: encoding.Encoder, room: LiveFeedRoom) => {
    encoding.writeVarUint(encoder, messageYjsSyncStep2);

    while (decoding.hasContent(decoder)) {
        const guid = decoding.readVarString(decoder);
        const diffUpdate = Y.encodeStateAsUpdate(room.getObject(guid), decoding.readVarUint8Array(decoder));
        if (diffUpdate.length > 0) {
            encoding.writeVarString(encoder, guid);
            encoding.writeVarUint8Array(encoder, diffUpdate);
        }
    }
};

export const readSyncStep1 = (decoder: decoding.Decoder, encoder: encoding.Encoder, room: LiveFeedRoom) => {
    writeSyncStep2(decoder, encoder, room);
};

export const readSyncStep2 = (decoder: decoding.Decoder, room: LiveFeedRoom, transactionOrigin: any) => {
    try {
        while (decoding.hasContent(decoder)) {
            const guid = decoding.readVarString(decoder);
            Y.applyUpdate(room.getObject(guid), decoding.readVarUint8Array(decoder), transactionOrigin);
        }
    } catch (error) {
        // This catches errors that are thrown by event handlers
        console.error('Caught error while handling a Yjs update', error);
    }
};

export const readUpdate = readSyncStep2;

export const readSyncMessage = (decoder: decoding.Decoder, encoder: encoding.Encoder, room: LiveFeedRoom, transactionOrigin: any) => {
    const messageType = decoding.readVarUint(decoder);
    switch (messageType) {
        case messageYjsSyncStep1:
            readSyncStep1(decoder, encoder, room);
            break;
        case messageYjsSyncStep2:
            readSyncStep2(decoder, room, transactionOrigin);
            break;
        case messageYjsUpdate:
            readUpdate(decoder, room, transactionOrigin);
            break;
        default:
            throw new Error('Unknown message type');
    }
    return messageType;
};

export const writeUpdate = (encoder: encoding.Encoder, update: Uint8Array) => {
    encoding.writeVarUint(encoder, messageYjsUpdate);
    encoding.writeVarUint8Array(encoder, update);
};
