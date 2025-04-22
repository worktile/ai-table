import { helpers } from 'ngx-tethys/util';
import { AITableField, AITableFieldType, FieldValue, ProgressFieldValue, SelectSettings } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { compareNumber, isEmpty } from '../../index';
import { Field } from './field';

export class ProgressField extends Field {
    override isValid(cellValue: FieldValue): boolean {
        return typeof cellValue === 'number' || cellValue === null;
    }

    override isMeetFilter(condition: AITableFilterCondition<number>, cellValue: ProgressFieldValue) {
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
                return cellValue != null &&  cellValue < condition.value;
            case AITableFilterOperation.ne:
                return cellValue == null || Number.isNaN(condition.value) || cellValue !== condition.value;
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(cellValue1: ProgressFieldValue, cellValue2: ProgressFieldValue): number {
        return compareNumber(cellValue1, cellValue2);
    }

    override cellFullText(transformValue: ProgressFieldValue): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(`${transformValue}%`);
        }
        return fullText;
    }

    override toFieldValue(
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
