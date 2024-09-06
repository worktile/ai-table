import * as Y from 'yjs';
import { Observable } from 'lib0/observable';
import { LiveFeedObject } from './feed-object';

export class LiveFeedRoom extends Observable<string> {
    objects: Map<string, LiveFeedObject> = new Map();
    roomId: string;

    #pendingUpdates: LiveFeedObjectUpdate[] = [];

    #isPendingUpdate = false;

    constructor(options: { roomId: string; objects: LiveFeedObject[] }) {
        super();
        this.roomId = options.roomId;
        this.initObjects(options.objects);
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
        object.getMap(object.typeName).observeDeep((events: Array<Y.YEvent<any>>, transaction: Y.Transaction) => {
            this.emit('change', [{
                events,
                guid: object.guid,
                transaction
            }]);
        });
        object.on('update', this.#emitObjectUpdate);
    }

    #emitObjectUpdate = (update: Uint8Array, origin: any, doc: Y.Doc, transaction: Y.Transaction) => {
        this.#pendingUpdates.push({
            update,
            origin,
            transaction,
            guid: doc.guid
        });
        if (!this.#isPendingUpdate) {
            this.#isPendingUpdate = true;
            Promise.resolve().then(() => {
                this.emit('update', [this.#pendingUpdates]);
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

    hasObject(guid: string) {
        const object = this.objects.get(guid);
        return !!object;
    }
}

export interface LiveFeedObjectUpdate {
    update: Uint8Array;
    origin: any;
    transaction: Y.Transaction;
    guid: string;
}

export interface LiveFeedObjectChange {
    events: Y.YEvent<any>[];
    transaction: Y.Transaction;
    guid: string;
}
