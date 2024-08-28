import * as Y from 'yjs';
import { Observable } from 'lib0/observable';
import { LiveFeedProvider } from './feed-provider';

export const convertYDocToFeedObject = (yDoc: Y.Doc, typeName: string) => {
    const feedObject = yDoc as LiveFeedObject;
    feedObject.typeName = typeName;
    return feedObject;
};

export class LiveFeedObject extends Y.Doc {
    typeName?: string;

    constructor(options: { guid: string; typeName: string }, provider?: LiveFeedProvider) {
        super({ guid: options.guid });
        this.typeName = options.typeName;
    }

    // 检测数据变化，如果发现新增文档则需要将新增的文档转换为 feed-object （调用 convertYDocToFeedObject）
    // 然后调用 room 的 addObject 方法，将对象添加到房间内，整体管理
}

export class LiveFeedRoom extends Observable<string> {
    objects: Map<string, LiveFeedObject> = new Map();
    guid: string;

    #pendingUpdates: LiveFeedObjectUpdate[] = [];

    #pendingChanges: LiveFeedObjectChange[] = [];

    #isPendingUpdate = false;

    #isPendingChange = false;

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
        if (!object.typeName) {
            throw new Error('can not resolve typeName');
        }
        this.objects.set(object.guid, object);
        object.get(object.typeName).observeDeep((events: Array<Y.YEvent<any>>, transaction: Y.Transaction) => {
            this.#emitObjectChange(events, object, transaction);
        });
        object.on('update', this.#emitObjectUpdate);
    }

    #emitObjectChange(events: Y.YEvent<any>[], doc: Y.Doc, transaction: Y.Transaction) {
        this.#pendingChanges.push({
            events,
            guid: doc.guid,
            transaction
        });
        if (!this.#isPendingChange) {
            this.#isPendingChange = true;
            Promise.resolve().then(() => {
                this.emit('update', this.#pendingChanges);
                this.#pendingChanges = [];
                this.#isPendingChange = false;
            });
        }
    }

    #emitObjectUpdate = (update: Uint8Array, arg1: any, doc: Y.Doc, transaction: Y.Transaction) => {
        this.#pendingUpdates.push({
            update,
            transaction,
            guid: doc.guid
        });
        if (!this.#isPendingUpdate) {
            this.#isPendingUpdate = true;
            Promise.resolve().then(() => {
                this.emit('update', this.#pendingUpdates);
                this.#pendingUpdates = [];
                this.#isPendingUpdate = false;
            });
        }
    };

    removeObject(object: LiveFeedObject) {
        this.objects.delete(object.guid);
        object.off('update', this.#emitObjectUpdate);
        object.destroy();
    }

    getObject(guid: string) {
        const object = this.objects.get(guid);
        if (!object) {
            throw new Error(`can not resolve feed object by guid: ${guid}`);
        }
        return object;
    }
}

export interface LiveFeedObjectUpdate {
    update: Uint8Array;
    transaction: Y.Transaction;
    guid: string;
}

export interface LiveFeedObjectChange {
    events: Y.YEvent<any>[];
    transaction: Y.Transaction;
    guid: string;
}
