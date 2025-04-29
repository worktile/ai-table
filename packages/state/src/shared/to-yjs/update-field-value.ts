import { AITable } from '@ai-table/grid';
import { SharedType, SyncArrayElement, SyncMapElement, UpdateFieldValueAction } from '../../types';
import { getSharedMapValueIndex, getSharedRecordIndex } from '../utils';
import * as Y from 'yjs';

export default function updateFieldValue(aiTable: AITable, sharedType: SharedType, action: UpdateFieldValueAction): SharedType {
    const sharedRecords = sharedType.get('records');
    const sharedFields = sharedType.get('fields')!;
    if (sharedRecords && sharedFields) {
        const recordIndex = getSharedRecordIndex(sharedRecords as Y.Array<SyncArrayElement>, action.path[0]);
        const fieldIndex = getSharedMapValueIndex(sharedFields as Y.Array<SyncMapElement>, action.path[1]);
        if (recordIndex > -1 && fieldIndex > -1) {
            const record = sharedRecords?.get(recordIndex) as SyncArrayElement;
            const customField = record.get(1);
            if (fieldIndex < customField.length) {
                customField.delete(fieldIndex);
                customField.insert(fieldIndex, [action.newFieldValue]);
            } else {
                // 幽灵单元格，协同的后端会对这样的数据进行纠正，但是在纠正同步到位之前，前端可能会出现幽灵单元格
                console.error('Field index out of bounds, cannot update field value');
            }
        }
    }

    return sharedType;
}
