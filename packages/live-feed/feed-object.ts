import * as Y from 'yjs';
import { Observable } from 'lib0/observable';
import * as url from 'lib0/url';
import * as math from 'lib0/math';
import * as time from 'lib0/time';

// 尽量让使用方感受不到任何 subdoc 的概念

/**
 * 可协同的对象
 */
export class LiveFeedObject extends Y.Doc {
    typeName: string;

    constructor(options: { guid: string; typeName: string }) {
        super({ guid: options.guid });
        this.typeName = options.typeName;
    }

    // 1.存储数据
    // 2.本地数据变化后同步给协同方
    // 3.远程数据变化后应用到本地数据
}

export class LiveFeedRoom extends Observable<string> {
    objects: Map<string, LiveFeedObject> = new Map();
    guid: string;

    #pendingUpdates: LiveFeedObjectUpdate[] = [];

    #isPending = false;

    constructor(options: { guid: string; objects: LiveFeedObject[] }) {
        super();
        this.guid = options.guid;
    }

    initObjects(objects: LiveFeedObject[]) {
        objects.forEach((object: LiveFeedObject) => {
            this.addObject(object);
        });
    }

    addObject(object: LiveFeedObject) {
        this.objects.set(object.guid, object);
        object.get(object.typeName).observeDeep((events: Array<Y.YEvent<any>>, transaction: Y.Transaction) => {
            this.emit('change', [
                {
                    events,
                    transaction,
                    guid: object.guid
                }
            ]);
        });
        object.on('update', this.#emitObjectUpdate);
    }

    #emitObjectUpdate = (update: Uint8Array, arg1: any, doc: Y.Doc, transaction: Y.Transaction) => {
        this.#pendingUpdates.push({
            update,
            transaction,
            guid: doc.guid
        });
        if (!this.#isPending) {
            this.#isPending = true;
            Promise.resolve().then(() => {
                this.emit('update', this.#pendingUpdates);
                this.#pendingUpdates = [];
                this.#isPending = false;
            });
        }
    };

    removeObject(object: LiveFeedObject) {
        this.objects.delete(object.guid);
        object.off('update', this.#emitObjectUpdate);
        object.destroy();
    }
}

export interface LiveFeedObjectUpdate {
    update: Uint8Array;
    transaction: Y.Transaction;
    guid: string;
}

export interface LiveFeedProviderOptions {
    params: { [x: string]: string };
    WebSocketPolyfill: typeof WebSocket;
    connect: boolean;
}

export class LiveFeedProvider extends Observable<string> {
    room: LiveFeedRoom;
    options: LiveFeedProviderOptions;
    serverUrl: string;

    shouldConnect = false;
    hasConnected = false;
    connecting = false;
    unsuccessfulReconnects = 0;
    lastMessageReceived = 0;

    #synced = false;

    ws?: WebSocket | null;

    constructor(
        room: LiveFeedRoom,
        serverUrl: string,
        options: LiveFeedProviderOptions = { params: {}, WebSocketPolyfill: WebSocket, connect: true }
    ) {
        super();
        this.room = room;
        this.options = options;
        this.serverUrl = serverUrl;
        this.shouldConnect = options.connect;
    }

    url() {
        const encodedParams = url.encodeQueryParams(this.options.params);
        return this.serverUrl + '/' + this.room.guid + (encodedParams.length === 0 ? '' : '?' + encodedParams);
    }

    connect() {
        this.shouldConnect = true;
        if (!this.hasConnected && this.ws === null) {
            setupWS(this);
        }
    }

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

const reconnectTimeoutBase = 1200;
const maxReconnectTimeout = 12000;
const messageReconnectTimeout = 60000;

const setupWS = (provider: LiveFeedProvider) => {
    if (provider.shouldConnect && provider.ws === null) {
        const websocket = new provider.options.WebSocketPolyfill(provider.serverUrl);
        websocket.binaryType = 'arraybuffer';
        provider.ws = websocket;
        provider.connecting = true;
        provider.hasConnected = false;
        provider.synced = false;

        websocket.onmessage = (event) => {
            const { data } = event;
            if (typeof data === 'object') {
            }
        };
        websocket.onclose = () => {
            provider.ws = null;
            provider.connecting = false;
            if (provider.hasConnected) {
                provider.hasConnected = false;
                provider.synced = false;
                provider.emit('status', [
                    {
                        status: 'disconnected'
                    }
                ]);
            } else {
                provider.unsuccessfulReconnects++;
            }
            // Start with no reconnect timeout and increase timeout by
            // log10(unsuccessfulReconnects).
            // The idea is to increase reconnect timeout slowly and have no reconnect
            // timeout at the beginning (log(1) = 0)
            setTimeout(
                setupWS,
                math.min(math.log10(provider.unsuccessfulReconnects + 1) * reconnectTimeoutBase, maxReconnectTimeout),
                provider
            );
        };
        websocket.onopen = () => {
            provider.lastMessageReceived = time.getUnixTime();
            provider.connecting = false;
            provider.hasConnected = true;
            provider.unsuccessfulReconnects = 0;
            provider.emit('status', [
                {
                    status: 'connected'
                }
            ]);
            // sync ydoc
            const _syncInterval = setInterval(() => {
                if (!provider.synced && provider.hasConnected) {
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
