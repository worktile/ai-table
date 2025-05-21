import {
    AITableFilterCondition,
    AITableFilterOperation,
    AITableField,
    FieldValue,
    isEmpty,
    AITableSelectOption,
    Id
} from '@ai-table/utils';
import { AITable } from '../../core';

export const zhIntlCollator = typeof Intl !== 'undefined' ? new Intl.Collator('zh-CN') : undefined;

export function compareNumber(a: number | null, b: number | null): number {
    if (isEmpty(a) && isEmpty(b)) {
        return 0;
    }
    if (isEmpty(a)) {
        return -1;
    }
    if (isEmpty(b)) {
        return 1;
    }
    const a1 = a as number;
    const b1 = b as number;
    return a1 === b1 ? 0 : a1 > b1 ? 1 : -1;
}

export function compareString(a: string | null, b: string | null): number {
    if (a === b) {
        return 0;
    }
    if (a == null) {
        return -1;
    }
    if (b == null) {
        return 1;
    }

    //  pinyin sort
    return a === b ? 0 : zhIntlCollator ? zhIntlCollator.compare(a, b) : a.localeCompare(b, 'zh-CN') > 0 ? 1 : -1;
}

export function compareOption(a: Id[] | null, b: Id[] | null, options: AITableSelectOption[]): number {
    if (isEmpty(a) && isEmpty(b)) {
        return 0;
    }
    if (isEmpty(a)) {
        return 1;
    }
    if (isEmpty(b)) {
        return -1;
    }

    const arr1 = a as Id[];
    const arr2 = b as Id[];

    const optionOrderMap = new Map<Id, number>();
    options.forEach((option, index) => {
        optionOrderMap.set(option._id, index);
    });

    const minLength = Math.min(arr1.length, arr2.length);
    for (let i = 0; i < minLength; i++) {
        const order1 = optionOrderMap.get(arr1[i]) ?? Number.MAX_SAFE_INTEGER;
        const order2 = optionOrderMap.get(arr2[i]) ?? Number.MAX_SAFE_INTEGER;

        if (order1 !== order2) {
            return order1 - order2;
        }
    }

    // 如果前面的元素都相同，则长度较短的数组排在前面
    return arr1.length - arr2.length;
}

export function stringInclude(str: string, searchStr: string) {
    return str.toLowerCase().includes(searchStr.trim().toLowerCase());
}

/**
 * 两数组是否有交集
 */
export function hasIntersect<T extends number | string>(array1: T[], array2: T[]) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    for (const element of set1) {
        if (set2.has(element)) {
            return true;
        }
    }
    return false;
}

export function isMeetFilter(
    condition: AITableFilterCondition,
    cellValue: FieldValue,
    options?: {
        aiTable: AITable;
        field: AITableField;
    }
) {
    switch (condition.operation) {
        case AITableFilterOperation.empty:
        case AITableFilterOperation.exists: {
            return isEmptyOrNot(condition.operation, cellValue);
        }
        default: {
            return true;
        }
    }
}

export function isEmptyOrNot(operation: AITableFilterOperation.empty | AITableFilterOperation.exists, cellValue: FieldValue) {
    switch (operation) {
        case AITableFilterOperation.empty: {
            return isEmpty(cellValue);
        }
        case AITableFilterOperation.exists: {
            return !isEmpty(cellValue);
        }
        default: {
            throw new Error('compare operator type error');
        }
    }
}
