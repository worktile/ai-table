import { isEmpty, isNil } from 'lodash';
import { compareString, isMeetFilter, stringInclude } from '../operate';
import { AITableFilterCondition, AITableFilterOperation, FieldValue, TextFieldBase, TextFieldValue } from '@ai-table/utils';
import { FieldOperable } from '../field-operable';

export class TextField extends TextFieldBase implements FieldOperable<string, TextFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: TextFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.contain:
                return !isNil(cellValue) && stringInclude(cellValue, condition.value);
            default:
                return isMeetFilter(condition, cellValue);
        }
    }

    compare(cellValue1: TextFieldValue, cellValue2: TextFieldValue): number {
        const value1 = cellValueToSortValue(cellValue1);
        const value2 = cellValueToSortValue(cellValue2);
        return compareString(value1, value2);
    }

    toFieldValue(plainText: string): FieldValue | null {
        return toTextFieldValue(plainText);
    }
}

export function toTextFieldValue(plainText: string): FieldValue | null {
    return plainText.trim();
}

function cellValueToSortValue(cellValue: TextFieldValue): string | null {
    return (cellValue && cellValue.trim()) || null;
}
