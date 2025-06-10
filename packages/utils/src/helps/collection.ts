import { Dictionary, PropertyName, ValueIterateeCustom, keyBy as _keyBy } from 'lodash';

export function keyBy<T>(collection: Array<T>, iteratee?: ValueIterateeCustom<T, PropertyName>): Dictionary<T> {
    if (_keyBy) {
        return _keyBy(collection, iteratee);
    }
    const result: Dictionary<T> = {};
    collection.forEach((item) => {
        if (typeof iteratee === 'function') {
            const key = String(iteratee(item));
            result[key] = item;
        } else {
            const key = String(item[iteratee as keyof T]);
            result[key] = item;
        }
    });
    return result;
}
