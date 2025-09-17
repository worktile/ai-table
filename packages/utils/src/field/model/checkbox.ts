import { FieldBase } from './field';
import { AITableFieldStatTypeItemInfo, AITableStatType, DateFieldValue } from '../../types';
import { DEFAULT_FIELD_STAT_TYPE_MAP } from '../../constants';
import _ from 'lodash';

export class CheckboxFieldBase extends FieldBase {
    constructor(statTypes?: AITableFieldStatTypeItemInfo[]) {
        super(
            statTypes || [
                DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.None]!,
                DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.CountAll]!,
                DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Checked]!,
                DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.UnChecked]!,
                DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentChecked]!,
                DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentUnChecked]!
            ]
        );
    }

    override isValid(cellValue: DateFieldValue): boolean {
        return _.isNull(cellValue) || _.isUndefined(cellValue) || _.isBoolean(cellValue);
    }

    getDefaultValue() {
        return null;
    }
}
