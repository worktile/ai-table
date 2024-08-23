import { LiveFeedObject, LiveFeedRoom } from './feed-object';
import { Observable } from 'lib0/observable';
import * as url from 'lib0/url';
import * as math from 'lib0/math';
import * as time from 'lib0/time';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as Y from 'yjs';
import { LiveFeedProvider } from './feed-provider';

export const messageYjsSyncStep1 = 0;
export const messageYjsSyncStep2 = 1;
export const messageYjsUpdate = 2;

export const writeSyncStep2 = (decoder: decoding.Decoder, encoder: encoding.Encoder, provider: LiveFeedProvider) => {
    encoding.writeVarUint(encoder, messageYjsSyncStep2);
    let guid = decoding.readVarString(decoder);
    while (guid) {
        encoding.writeVarUint8Array(encoder, Y.encodeStateAsUpdate(provider.room.getObject(guid), decoding.readVarUint8Array(decoder)));
        guid = decoding.readVarString(decoder);
    }
};

/**
 * Read SyncStep1 message and reply with SyncStep2.
 *
 * @param {decoding.Decoder} decoder The reply to the received message
 * @param {encoding.Encoder} encoder The received message
 * @param {Y.Doc} doc
 */
export const readSyncStep1 = (decoder: decoding.Decoder, encoder: encoding.Encoder, provider: LiveFeedProvider) => {
    writeSyncStep2(decoder, encoder, provider);
};

export const readSyncStep2 = (decoder, doc, transactionOrigin) => {
    try {
        Y.applyUpdate(doc, decoding.readVarUint8Array(decoder), transactionOrigin);
    } catch (error) {
        // This catches errors that are thrown by event handlers
        console.error('Caught error while handling a Yjs update', error);
    }
};
