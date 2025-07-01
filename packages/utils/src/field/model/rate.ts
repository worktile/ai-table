import { DEFAULT_FIELD_STAT_TYPE_ITEMS, DEFAULT_FIELD_STAT_TYPE_MAP } from '../../constants';
import { AITableStatType, RateFieldValue } from '../../types';
import { FieldBase } from './field';
import { isNumberValid } from './number';

export class RateFieldBase extends FieldBase {
    constructor() {
        super([
            ...DEFAULT_FIELD_STAT_TYPE_ITEMS,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Max]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Min]!
        ]);
    }
    override isValid(cellValue: RateFieldValue): boolean {
        return isNumberValid(cellValue);
    }
}
