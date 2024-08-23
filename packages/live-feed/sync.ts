import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as Y from 'yjs';
import { LiveFeedProvider } from './feed-provider';

export const messageYjsSyncStep1 = 0;
export const messageYjsSyncStep2 = 1;
export const messageYjsUpdate = 2;

export const writeSyncStep2 = (decoder: decoding.Decoder, encoder: encoding.Encoder, provider: LiveFeedProvider) => {
    encoding.writeVarUint(encoder, messageYjsSyncStep2);
    let guid = decoding.readVarString(decoder);
    while (guid) {
        const diffUpdate = Y.encodeStateAsUpdate(provider.room.getObject(guid), decoding.readVarUint8Array(decoder));
        if (diffUpdate.length > 0) {
            encoding.writeVarString(encoder, guid);
            encoding.writeVarUint8Array(encoder, diffUpdate);    
        }
        // TODO: 可能存在异常，失去失败？
        guid = decoding.readVarString(decoder);
    }
};

export const readSyncStep1 = (decoder: decoding.Decoder, encoder: encoding.Encoder, provider: LiveFeedProvider) => {
    writeSyncStep2(decoder, encoder, provider);
};

export const readSyncStep2 = (decoder: decoding.Decoder, provider: LiveFeedProvider, transactionOrigin: any) => {
    try {
        let guid = decoding.readVarString(decoder);
        while(guid) {
            Y.applyUpdate(provider.room.getObject(guid), decoding.readVarUint8Array(decoder), transactionOrigin);
            // TODO: 可能存在异常，失去失败？
            guid = decoding.readVarString(decoder);
        }
    } catch (error) {
        // This catches errors that are thrown by event handlers
        console.error('Caught error while handling a Yjs update', error);
    }
};

export const readUpdate = readSyncStep2
