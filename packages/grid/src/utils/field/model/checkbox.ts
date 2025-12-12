import {
    AITableFilterCondition,
    AITableFilterOperation,
    AITableField,
    AITableFieldType,
    CheckboxFieldValue,
    FieldValue,
    isUndefinedOrNull,
    CheckboxFieldBase
} from '@ai-table/utils';
import { FieldOperable } from '../field-operable';
import { compareNumber, isMeetFilter } from '../operate';

export class CheckboxField extends CheckboxFieldBase implements FieldOperable<string, CheckboxFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: CheckboxFieldValue) {
        if (cellValue === null) {
            if (condition.operation === AITableFilterOperation.empty) {
                return true;
            } else {
                return false;
            }
        }
        const cellTextValue = cellValue;
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return !cellTextValue;
            case AITableFilterOperation.exists:
                return !!cellTextValue;
            default:
                return isMeetFilter(condition, cellTextValue);
        }
    }

    compare(cellValue1: CheckboxFieldValue, cellValue2: CheckboxFieldValue): number {
        const value1 = cellValueToSortValue(cellValue1);
        const value2 = cellValueToSortValue(cellValue2);
        return compareNumber(value1, value2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        if (originData) {
            const { field, cellValue } = originData;
            if (field.type === AITableFieldType.checkbox) {
                return cellValue;
            }
        }
        return null;
    }
}

function cellValueToSortValue(cellValue: CheckboxFieldValue): number {
    if (isUndefinedOrNull(cellValue)) {
        return 0;
    }
    return cellValue ? 1 : 0;
}
