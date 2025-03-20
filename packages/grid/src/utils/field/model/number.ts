import { helpers } from 'ngx-tethys/util';
import { AITableField, AITableFieldType, FieldValue, SelectSettings } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { isEmpty } from '../../common';
import { compareNumber } from '../operate';
import { Field } from './field';

export class NumberField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<number>, cellValue: FieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.eq:
                return !Number.isNaN(condition.value) && cellValue != null && cellValue !== '' && condition.value === cellValue;
            case AITableFilterOperation.gte:
                return cellValue != null && cellValue !== '' && cellValue >= condition.value;
            case AITableFilterOperation.lte:
                return cellValue != null && cellValue !== '' && cellValue <= condition.value;
            case AITableFilterOperation.gt:
                return cellValue != null && cellValue !== '' && cellValue > condition.value;
            case AITableFilterOperation.lt:
                return cellValue != null && cellValue !== '' && cellValue < condition.value;
            case AITableFilterOperation.ne:
                return cellValue == null || cellValue == '' || Number.isNaN(condition.value) || cellValue !== condition.value;
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(cellValue1: number, cellValue2: number): number {
        return compareNumber(cellValue1, cellValue2);
    }

    override pasteValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
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
}
