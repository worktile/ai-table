import { helpers } from 'ngx-tethys/util';
import {
    AITableField,
    AITableFieldType,
    AITableFilterCondition,
    AITableFilterOperation,
    FieldValue,
    RateFieldValue,
    SelectSettings,
    RateFieldBase
} from '@ai-table/utils';
import { compareNumber, isMeetFilter } from '../operate';
import { FieldOperable } from '../field-operable';
import { isEmpty } from 'lodash';

export class RateField extends RateFieldBase implements FieldOperable<string[], RateFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<string[]>, cellValue: RateFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.in:
                const isContain = condition.value.some((item) => String(item) === String(cellValue));
                return !isEmpty(cellValue) && isContain;
            case AITableFilterOperation.nin:
                const noContain = condition.value.every((item) => String(item) !== String(cellValue));
                return isEmpty(cellValue) || noContain;
            default:
                return isMeetFilter(condition, cellValue);
        }
    }

    compare(cellValue1: RateFieldValue, cellValue2: RateFieldValue): number {
        return compareNumber(cellValue1, cellValue2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        return toRateFieldValue(plainText, targetField, originData);
    }
}

export function toRateFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue }
): FieldValue | null {
    let value: any = plainText.trim();
    if (originData) {
        const { field, cellValue } = originData;
        switch (field.type) {
            case AITableFieldType.rate:
            case AITableFieldType.number:
            case AITableFieldType.progress:
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

    if (!isEmpty(value)) {
        const rateValue = Number(value);
        if (!Number.isNaN(rateValue) && rateValue > 0 && rateValue < 5) {
            return Math.round(rateValue);
        }
        return 5;
    }

    return null;
}
