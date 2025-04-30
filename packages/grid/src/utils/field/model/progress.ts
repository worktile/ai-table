import { helpers, isEmpty } from 'ngx-tethys/util';
import { AITableField, AITableFieldType, AITableFilterCondition, AITableFilterOperation, FieldValue, ProgressFieldValue, SelectSettings } from '@ai-table/utils';
import { compareNumber, isMeetFilter } from '../operate';
import { ProgressFieldBase } from '@ai-table/utils';
import { FieldOperable } from '../field-operable';

export class ProgressField extends ProgressFieldBase implements FieldOperable<number, ProgressFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<number>, cellValue: ProgressFieldValue) {
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

    compare(cellValue1: ProgressFieldValue, cellValue2: ProgressFieldValue): number {
        return compareNumber(cellValue1, cellValue2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        return toProgressFieldValue(plainText, targetField, originData);
    }
}

export function toProgressFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue }
): FieldValue | null {
    let value: any = plainText.trim();
    if (originData) {
        const { field, cellValue } = originData;
        switch (field.type) {
            case AITableFieldType.progress:
            case AITableFieldType.rate:
            case AITableFieldType.number:
                value = cellValue;
                break;
            case AITableFieldType.select:
                if (cellValue && Array.isArray(cellValue) && cellValue.length) {
                    const optionsMap = helpers.keyBy((field.settings as SelectSettings).options || [], '_id');
                    value = optionsMap[cellValue[0]]?.text;
                }
                break;
            default:
                break;
        }
    }

    const progressRegex = /^(?:100|[1-9]?\d(?:\.\d+)?)\s*%$/;
    if (progressRegex.test(value)) {
        value = parseFloat(value);
    }

    if (!isEmpty(value)) {
        let progressValue = Number(value);
        if (!Number.isNaN(progressValue)) {
            progressValue = Math.round(progressValue);
            if (progressValue >= 0 && progressValue <= 100) {
                return progressValue;
            }
        }
    }

    return null;
}
