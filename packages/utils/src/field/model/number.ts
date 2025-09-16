import { DEFAULT_FIELD_STAT_TYPE_ITEMS, DEFAULT_FIELD_STAT_TYPE_MAP } from '../../constants';
import { AITableStatType, NumberFieldValue } from '../../types';
import { FieldBase } from './field';

export const isNumberValid = (cellValue: NumberFieldValue): cellValue is NumberFieldValue => {
    return typeof cellValue === 'number' || cellValue === null;
};

export class NumberFieldBase extends FieldBase {
    constructor() {
        super([
            ...DEFAULT_FIELD_STAT_TYPE_ITEMS,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Sum]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Average]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Max]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Min]!
        ]);
    }

    override isValid(cellValue: NumberFieldValue): boolean {
        return isNumberValid(cellValue);
    }

    getDefaultValue() {
        return null;
    }
}
