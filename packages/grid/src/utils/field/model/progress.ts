import { helpers } from 'ngx-tethys/util';
import { AITableField, AITableFieldType, FieldValue, SelectSettings } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { compareNumber, isEmpty } from '../../index';
import { Field } from './field';

export class ProgressField extends Field {
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

    override cellFullText(transformValue: number): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(`${transformValue}%`);
        }
        return fullText;
    }

    override pasteValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        //  进度支持选中单元格后、验证、再提交

        // let value: any = plainText.trim();
        // if (originData) {
        //     const { field, cellValue } = originData;
        //     switch (field.type) {
        //         case AITableFieldType.progress:
        //         case AITableFieldType.rate:
        //         case AITableFieldType.number:
        //             value = cellValue;
        //             break;
        //         case AITableFieldType.select:
        //             if (cellValue && Array.isArray(cellValue) && cellValue.length) {
        //                 const optionsMap = helpers.keyBy((field.settings as SelectSettings).options || [], '_id');
        //                 value = optionsMap[cellValue[0]]?.text;
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        // }

        // if (!isEmpty(value)) {
        //     const progressValue = Number(value);
        //     if (!Number.isNaN(progressValue) && progressValue >= 0 && progressValue <= 100) {
        //         return progressValue;
        //     }
        // }

        return null;
    }
}
