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
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as mutex from 'lib0/mutex';
import { Observable } from 'lib0/observable';
import * as math from 'lib0/math';
import * as url from 'lib0/url';
import { LiveFeedObject, LiveFeedRoom } from './feed-object';

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageAuth = 2;

const reconnectTimeoutBase = 1200;
const maxReconnectTimeout = 12000;
const messageReconnectTimeout = 60000;

const setupWS = (provider: LiveFeedProvider) => {
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
                
            }
        };
        websocket.onclose = () => {
            provider.ws = null;
            provider.wsconnecting = false;
            if (provider.wsconnected) {
                provider.wsconnected = false;
                provider.synced = false;
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
            const _syncInterval = setInterval(() => {
                if (!provider.synced && provider.wsconnected) {
                    // sync ydoc
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

export class LiveFeedProvider extends Observable<string> {
    roomname: any;
    serverUrl: string;
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
    room: LiveFeedRoom;
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
        {
            connect = true,
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
        this.params = params;
        this._WS = WebSocketPolyfill;
        this.wsconnected = false;
        this.wsconnecting = false;
        this.bcconnected = false;
        this.wsUnsuccessfulReconnects = 0;
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
                }
            }, resyncInterval) as any;
        }
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