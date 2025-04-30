import { helpers } from 'ngx-tethys/util';
import { AITableField, AITableFieldType, AITableFilterCondition, AITableFilterOperation, FieldValue, NumberFieldValue, SelectSettings } from '@ai-table/utils';
import { compareNumber, isMeetFilter } from '../operate';
import { isEmpty } from 'lodash';
import { NumberFieldBase } from '@ai-table/utils';
import { FieldOperable } from '../field-operable';
export class NumberField extends NumberFieldBase implements FieldOperable<number, NumberFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<number>, cellValue: NumberFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.eq:
                return !Number.isNaN(condition.value) && cellValue != null && condition.value === cellValue;
            case AITableFilterOperation.gte:
                return cellValue != null && cellValue >= condition.value;
            case AITableFilterOperation.lte:
                return cellValue != null && cellValue <= condition.value;
            case AITableFilterOperation.gt:
                return cellValue != null && cellValue > condition.value;
            case AITableFilterOperation.lt:
                return cellValue != null && cellValue < condition.value;
            case AITableFilterOperation.ne:
                return cellValue == null || Number.isNaN(condition.value) || cellValue !== condition.value;
            default:
                return isMeetFilter(condition, cellValue);
        }
    }

    compare(cellValue1: NumberFieldValue, cellValue2: NumberFieldValue): number {
        return compareNumber(cellValue1, cellValue2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        return toNumberFieldValue(plainText, targetField, originData);
    }
}

export function toNumberFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue }
): NumberFieldValue | null {
    let text = plainText.trim();

    if (originData) {
        const { field, cellValue } = originData;
        const fieldType = field.type;

        switch (fieldType) {
            case AITableFieldType.number:
            case AITableFieldType.rate:
            case AITableFieldType.progress:
                return cellValue;
            case AITableFieldType.select:
                if (cellValue && Array.isArray(cellValue) && cellValue.length) {
                    const optionsMap = helpers.keyBy((field.settings as SelectSettings).options || [], '_id');
                    text = optionsMap[cellValue[0]]?.text;
                }
                break;
            default:
                break;
        }
    }

    if (text && !isEmpty(text) && !Number.isNaN(Number(text))) {
        return Number(text);
    }
    return null;
}
