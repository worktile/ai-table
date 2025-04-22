import { isNil } from 'lodash';
import { FieldValue, TextFieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { isEmpty } from '../../common';
import { compareString, stringInclude } from '../operate';
import { Field } from './field';

export class TextField extends Field {
    override isValid(cellValue: FieldValue): boolean {
        return typeof cellValue === 'string' || cellValue === null;
    }

    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: TextFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.contain:
                return !isNil(cellValue) && stringInclude(cellValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(cellValue1: TextFieldValue, cellValue2: TextFieldValue): number {
        const value1 = cellValueToSortValue(cellValue1);
        const value2 = cellValueToSortValue(cellValue2);
        return compareString(value1, value2);
    }

    override toFieldValue(plainText: string): FieldValue | null {
        return toTextFieldValue(plainText);
    }
}

export function toTextFieldValue(plainText: string): FieldValue | null {
    return plainText.trim();
}

function cellValueToSortValue(cellValue: TextFieldValue): string | null {
    return (cellValue && cellValue.trim()) || null;
}
