import { differenceInDays, differenceInMonths, fromUnixTime, subDays } from 'date-fns';
import { isArray, TinyDate } from 'ngx-tethys/util';
import {
    AITableFilterCondition,
    AITableFilterOperation,
    DateFieldBase,
    FieldOptions,
    isDateValid,
    AITableField,
    AITableFieldType,
    DateFieldValue,
    FieldValue,
    isEmpty,
    isUndefinedOrNull,
    isDateAndReturnDate,
    DEFAULT_FIELD_STAT_TYPE_ITEMS,
    AITableStatType,
    CheckboxFieldBase,
    DEFAULT_FIELD_STAT_TYPE_MAP
} from '@ai-table/utils';
import { FieldOperable } from '../field-operable';
import { compareNumber, isMeetFilter } from '../operate';
import { transformToCellText } from '../../cell';

export class CheckboxField extends CheckboxFieldBase implements FieldOperable<string, DateFieldValue> {
    constructor() {
        super([
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.None]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.CountAll]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Filled]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Empty]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Unique]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentFilled]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentEmpty]!
        ]);
    }

    override transformCellValue(cellValue: FieldValue, options: FieldOptions) {
        return transformToCellText(cellValue, options);
    }

    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: DateFieldValue) {
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
                return isEmpty(cellTextValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellTextValue);
            default:
                return isMeetFilter(condition, cellTextValue);
        }
    }

    compare(cellValue1: DateFieldValue, cellValue2: DateFieldValue): number {
        const value1 = cellValueToSortValue(cellValue1);
        const value2 = cellValueToSortValue(cellValue2);
        return compareNumber(value1, value2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        return null;
    }
}

function cellValueToSortValue(cellValue: DateFieldValue): number {
    if (isUndefinedOrNull(cellValue) || !isDateValid(cellValue)) {
        return 0;
    }
    return cellValue?.timestamp ?? 0;
}
