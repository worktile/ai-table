import { isUndefinedOrNull, isEmpty as isArrayEmpty, isArray, isObject } from 'ngx-tethys/util';

export function isEmpty(value: any) {
    if (isArray(value)) {
        return isArrayEmpty(value);
    }

    if (isObject(value)) {
        return Reflect.ownKeys(value).length === 0;
    }

    return isUndefinedOrNull(value) || value == '';
}
