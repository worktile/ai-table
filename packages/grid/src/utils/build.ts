import { VTableFields, VTableRecords, VTableViewType }  from '../core';;
import { VTableGridData } from '../types';

export const buildGridData = (recordValue: VTableRecords, fieldsValue: VTableFields): VTableGridData => {
    return {
        type: VTableViewType.Grid,
        fields: fieldsValue,
        records: recordValue
    };
};
