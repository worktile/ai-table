import * as Y from 'yjs';
import { Observable } from 'lib0/observable';

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
