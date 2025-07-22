import { FieldBase } from './field';
import { AITableFieldStatTypeItemInfo, AITableStatType, DateFieldValue } from '../../types';
import { DEFAULT_FIELD_STAT_TYPE_ITEMS, DEFAULT_FIELD_STAT_TYPE_MAP } from '../../constants';
import _ from 'lodash';

export class CheckboxFieldBase extends FieldBase {
    constructor(statTypes?: AITableFieldStatTypeItemInfo[]) {
        super(statTypes || DEFAULT_FIELD_STAT_TYPE_ITEMS);
    }

    override isValid(cellValue: DateFieldValue): boolean {
        return _.isNull(cellValue) || _.isUndefined(cellValue) || _.isBoolean(cellValue);
    }
}
