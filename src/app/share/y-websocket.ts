/*
Unlike stated in the LICENSE file, it is not necessary to include the copyright notice and permission notice when you copy code from this file.
*/

/**
 * @module provider/websocket
 */

/* eslint-env browser */
import * as Y from 'yjs'; // eslint-disable-line
import * as bc from 'lib0/broadcastchannel';
import * as time from 'lib0/time';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as authProtocol from 'y-protocols/auth';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as mutex from 'lib0/mutex';
import { Observable } from 'lib0/observable';
import * as math from 'lib0/math';
import * as url from 'lib0/url';
import { Observable as RxjsObservable } from 'rxjs';
import { LiveBlockProvider } from './live-block-provider';

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageAuth = 2;

/**
 *                       encoder,          decoder,          provider,          emitSynced, messageType
 * @type {Array<function(encoding.Encoder, decoding.Decoder, WebsocketProvider, boolean,    number):void>}
 */
const messageHandlers = [];

messageHandlers[messageSync] = (encoder, decoder, provider: WebsocketProvider, emitSynced, messageType) => {
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
    encoding.writeVarString(encoder, provider.doc.guid);
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

const reconnectTimeoutBase = 1200;
const maxReconnectTimeout = 12000;
// @todo - this should depend on awareness.outdatedTime
const messageReconnectTimeout = 60000;

/**
 * @param {WebsocketProvider} provider
 * @param {string} reason
 */
const permissionDeniedHandler = (provider: WebsocketProvider, reason) => {
    console.warn(`Permission denied to access ${provider.url}.\n${reason}`);
};

/**
 * @param {WebsocketProvider} provider
 */
const setupWS = (provider: WebsocketProvider) => {
    if (provider.shouldConnect && provider.ws === null) {
        const websocket = new provider._WS(provider.url);
        websocket.binaryType = 'arraybuffer';
        provider.ws = websocket;
        provider.wsconnecting = true;
        provider.wsconnected = false;
        provider.synced = false;

        websocket.onmessage = (event) => {
            const { data } = event;
            if (typeof data === 'object') {
                provider.wsLastMessageReceived = time.getUnixTime();
                const buf = new Uint8Array(event.data);
                const decoder = decoding.createDecoder(buf);
                const encoder = encoding.createEncoder();
                const messageType = decoding.readVarUint(decoder);
                const guid = decoding.readVarString(decoder);
                if (guid !== provider.doc.guid) {
                    console.log('子文档')
                    const liveBlock = provider.liveBlocks.get(guid);
                    if (liveBlock) {
                        liveBlock.readMessage(messageType, encoder, decoder)
                    }
                    return;
                }
                const messageHandler = provider.messageHandlers[messageType];
                if (/** @type {any} */ messageHandler) {
                    const syncMessageType = messageHandler(encoder, decoder, provider, true, messageType);
                    if (syncMessageType === syncProtocol.messageYjsSyncStep1) {
                        websocket.send(encoding.toUint8Array(encoder));
                    }
                } else {
                    console.error('Unable to compute message');
                }
            }
        };
        websocket.onclose = () => {
            provider.ws = null;
            provider.wsconnecting = false;
            if (provider.wsconnected) {
                provider.wsconnected = false;
                provider.synced = false;
                // update awareness (all users except local left)
                awarenessProtocol.removeAwarenessStates(
                    provider.awareness,
                    Array.from(provider.awareness.getStates().keys() as unknown as number[]).filter(
                        (client: number) => client !== provider.doc.clientID
                    ),
                    provider
                );
                provider.emit('status', [
                    {
                        status: 'disconnected'
                    }
                ]);
            } else {
                provider.wsUnsuccessfulReconnects++;
            }
            // Start with no reconnect timeout and increase timeout by
            // log10(wsUnsuccessfulReconnects).
            // The idea is to increase reconnect timeout slowly and have no reconnect
            // timeout at the beginning (log(1) = 0)
            setTimeout(
                setupWS,
                math.min(math.log10(provider.wsUnsuccessfulReconnects + 1) * reconnectTimeoutBase, maxReconnectTimeout),
                provider
            );
        };
        websocket.onopen = () => {
            provider.wsLastMessageReceived = time.getUnixTime();
            provider.wsconnecting = false;
            provider.wsconnected = true;
            provider.wsUnsuccessfulReconnects = 0;
            provider.emit('status', [
                {
                    status: 'connected'
                }
            ]);
            // sync ydoc
            syncYDoc(provider, websocket);
            // sync local awareness state
            syncAwareness(provider, websocket);
            // resend step1 and awareness
            const _syncInterval = setInterval(() => {
                if (!provider.synced && provider.wsconnected) {
                    syncYDoc(provider, websocket);
                    syncAwareness(provider, websocket);
                } else {
                    clearInterval(_syncInterval);
                }
            }, 1000);
        };

        provider.emit('status', [
            {
                status: 'connecting'
            }
        ]);
    }
};

const syncYDoc = (provider: WebsocketProvider, websocket) => {
    // always send sync step 1 when connected
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    encoding.writeVarString(encoder, provider.doc.guid);
    syncProtocol.writeSyncStep1(encoder, provider.doc);
    websocket.send(encoding.toUint8Array(encoder));
};

const syncAwareness = (provider: WebsocketProvider, websocket) => {
    if (provider.awareness.getLocalState() !== null) {
        const encoderAwarenessState = encoding.createEncoder();
        encoding.writeVarUint(encoderAwarenessState, messageAwareness);
        encoding.writeVarString(encoderAwarenessState, provider.doc.guid);
        encoding.writeVarUint8Array(
            encoderAwarenessState,
            awarenessProtocol.encodeAwarenessUpdate(provider.awareness, [provider.doc.clientID])
        );
        websocket.send(encoding.toUint8Array(encoderAwarenessState));
    }
};

/**
 * @param {WebsocketProvider} provider
 * @param {ArrayBuffer} buf
 */
const broadcastMessage = (provider, buf) => {
    if (provider.wsconnected) {
        /** @type {WebSocket} */ provider.ws.send(buf);
    }
};

/**
 * Websocket Provider for Yjs. Creates a websocket connection to sync the shared document.
 * The document name is attached to the provided url. I.e. the following example
 * creates a websocket connection to http://localhost:1234/my-document-name
 *
 * @example
 *   import * as Y from 'yjs'
 *   import { WebsocketProvider } from 'y-websocket'
 *   const doc = new Y.Doc()
 *   const provider = new WebsocketProvider('http://localhost:1234', 'my-document-name', doc)
 *
 * @extends {Observable<string>}
 */
export class WebsocketProvider extends Observable<string> {
    bcChannel: string;
    roomname: any;
    serverUrl: string;
    doc: Y.Doc;
    liveBlocks: Map<string, LiveBlockProvider> = new Map();
    params: any;
    _WS: {
        new (url: string, protocols?: string | string[]): WebSocket;
        prototype: WebSocket;
        readonly CLOSED: number;
        readonly CLOSING: number;
        readonly CONNECTING: number;
        readonly OPEN: number;
    };
    awareness: awarenessProtocol.Awareness;
    wsconnected: boolean;
    wsconnecting: boolean;
    bcconnected: boolean;
    wsUnsuccessfulReconnects: number;
    messageHandlers: any[];
    mux: mutex.mutex;
    _synced: boolean;
    ws: any;
    wsLastMessageReceived: number;
    shouldConnect: boolean;
    _resyncInterval: number;
    _bcSubscriber: (data: any) => void;
    _updateHandler: (update: any, origin: any) => void;
    _awarenessUpdateHandler: ({ added, updated, removed }: { added: any; updated: any; removed: any }, origin: any) => void;
    _beforeUnloadHandler: () => void;
    _checkInterval: any;
    /**
     * @param {string} serverUrl
     * @param {string} roomname
     * @param {Y.Doc} doc
     * @param {object} [opts]
     * @param {boolean} [opts.connect]
     * @param {awarenessProtocol.Awareness} [opts.awareness]
     * @param {Object<string,string>} [opts.params]
     * @param {typeof WebSocket} [opts.WebSocketPolyfill] Optionall provide a WebSocket polyfill
     * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
     */
    constructor(
        serverUrl,
        roomname,
        doc,
        {
            connect = true,
            awareness = new awarenessProtocol.Awareness(doc),
            params = {},
            WebSocketPolyfill = WebSocket,
            resyncInterval = -1
        } = {}
    ) {
        super();
        // ensure that url is always ends with /
        while (serverUrl[serverUrl.length - 1] === '/') {
            serverUrl = serverUrl.slice(0, serverUrl.length - 1);
        }
        this.roomname = roomname;
        this.serverUrl = serverUrl;
        this.bcChannel = serverUrl + '/' + roomname;
        this.doc = doc;
        this.doc['liveBlocks'] = this.liveBlocks;
        this.params = params;
        this._WS = WebSocketPolyfill;
        this.awareness = awareness;
        this.wsconnected = false;
        this.wsconnecting = false;
        this.bcconnected = false;
        this.wsUnsuccessfulReconnects = 0;
        this.messageHandlers = messageHandlers.slice();
        this.mux = mutex.createMutex();
        /**
         * @type {boolean}
         */
        this._synced = false;
        /**
         * @type {WebSocket?}
         */
        this.ws = null;
        this.wsLastMessageReceived = 0;
        /**
         * Whether to connect to other peers or not
         * @type {boolean}
         */
        this.shouldConnect = connect;

        /**
         * @type {number}
         */
        this._resyncInterval = 0;
        if (resyncInterval > 0) {
            this._resyncInterval = /** @type {any} */ setInterval(() => {
                if (this.ws) {
                    // resend sync step 1
                    const encoder = encoding.createEncoder();
                    encoding.writeVarUint(encoder, messageSync);
                    encoding.writeVarString(encoder, this.doc.guid);
                    syncProtocol.writeSyncStep1(encoder, doc);
                    this.ws.send(encoding.toUint8Array(encoder));
                }
            }, resyncInterval) as any;
        }

        /**
         * Listens to Yjs updates and sends them to remote peers (ws and broadcastchannel)
         * @param {Uint8Array} update
         * @param {any} origin
         */
        this._updateHandler = (update, origin) => {
            if (origin !== this) {
                const encoder = encoding.createEncoder();
                encoding.writeVarUint(encoder, messageSync);
                encoding.writeVarString(encoder, this.doc.guid);
                syncProtocol.writeUpdate(encoder, update);
                broadcastMessage(this, encoding.toUint8Array(encoder));
            }
        };
        this.doc.on('update', this._updateHandler);
        /**
         * @param {any} changed
         * @param {any} origin
         */
        this._awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
            const changedClients = added.concat(updated).concat(removed);
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageAwareness);
            encoding.writeVarString(encoder, this.doc.guid);
            encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients));
            broadcastMessage(this, encoding.toUint8Array(encoder));
        };
        this._beforeUnloadHandler = () => {
            awarenessProtocol.removeAwarenessStates(this.awareness, [doc.clientID], 'window unload');
        };
        // if (typeof window !== 'undefined') {
        //     window.addEventListener('beforeunload', this._beforeUnloadHandler);
        // } else if (typeof process !== 'undefined') {
        //     process.on('exit', () => this._beforeUnloadHandler);
        // }
        awareness.on('update', this._awarenessUpdateHandler);
        this._checkInterval = /** @type {any} */ setInterval(() => {
            if (this.wsconnected && messageReconnectTimeout < time.getUnixTime() - this.wsLastMessageReceived) {
                // no message received in a long time - not even your own awareness
                // updates (which are updated every 15 seconds)
                /** @type {WebSocket} */ this.ws.close();
            }
        }, messageReconnectTimeout / 10);
        if (connect) {
            this.connect();
        }
    }

    get url() {
        const encodedParams = url.encodeQueryParams(this.params);
        return this.serverUrl + '/' + this.roomname + (encodedParams.length === 0 ? '' : '?' + encodedParams);
    }

    /**
     * @type {boolean}
     */
    get synced() {
        return this._synced;
    }

    set synced(state) {
        if (this._synced !== state) {
            this._synced = state;
            this.emit('synced', [state]);
            this.emit('sync', [state]);
        }
    }

    override destroy() {
        if (this._resyncInterval !== 0) {
            clearInterval(this._resyncInterval);
        }
        clearInterval(this._checkInterval);
        this.disconnect();
        // if (typeof window !== 'undefined') {
        //     window.removeEventListener('beforeunload', this._beforeUnloadHandler);
        // } else if (typeof process !== 'undefined') {
        //     process.off('exit', () => this._beforeUnloadHandler);
        // }
        this.awareness.off('update', this._awarenessUpdateHandler);
        this.doc.off('update', this._updateHandler);
        this.doc.destroy();
        super.destroy();
    }

    disconnect() {
        this.shouldConnect = false;
        if (this.ws !== null) {
            this.ws.close();
        }
    }

    connect() {
        this.shouldConnect = true;
        if (!this.wsconnected && this.ws === null) {
            setupWS(this);
        }
    }
}
