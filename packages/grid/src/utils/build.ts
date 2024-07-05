import { VTableFields, VTableRecords, VTableViewType } from '@v-table/core';
import { GridData, GridView } from '../types';

export const buildGridData = (recordValue: VTableRecords, fieldsValue: VTableFields, gridView: GridView): GridData => {
    return {
        id: gridView.id,
        type: VTableViewType.Grid,
        fields: fieldsValue,
        records: recordValue
    };
};
