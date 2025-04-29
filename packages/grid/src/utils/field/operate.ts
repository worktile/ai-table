import { isEmpty } from '../common';
import { AITableFilterCondition, AITableFilterOperation, AITableField, AITableReferences, FieldValue } from '@ai-table/utils';
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

export function cellFullText(transformValue: any, field: AITableField, references?: AITableReferences): string[] {
    let fullText: string[] = [];
    if (!isEmpty(transformValue)) {
        fullText.push(String(transformValue));
    }
    return fullText;
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
