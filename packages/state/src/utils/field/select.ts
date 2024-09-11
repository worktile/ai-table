import { isEmpty } from '../common';
import { AITableFilterCondition, AITableFilterOperation } from '../../types';
import { Field } from './field';
import { SelectFieldValue } from '@ai-table/grid';

export class SelectField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: SelectFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.in:
                return Array.isArray(condition.value) && hasIntersect(cellValue, condition.value);
            case AITableFilterOperation.nin:
                return Array.isArray(condition.value) && !hasIntersect(cellValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }
}

function hasIntersect<T extends number | string>(array1: T[], array2: T[]) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    for (const ele of set1) {
        if (set2.has(ele)) {
            return true;
        }
    }
    return false;
}
