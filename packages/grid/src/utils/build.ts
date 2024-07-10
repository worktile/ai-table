import { VTableFields, VTableRecords }  from '../core';;
import { VTableGridData } from '../types';

export const buildGridData = (recordValue: VTableRecords, fieldsValue: VTableFields): VTableGridData => {
    return {
        type: 'grid',
        fields: fieldsValue,
        records: recordValue
    };
};
