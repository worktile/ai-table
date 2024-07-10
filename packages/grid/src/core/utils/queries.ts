import { isUndefinedOrNull } from 'ngx-tethys/util';
import { FieldPath, Path, RecordPath, VTable, VTableField, VTableRecord } from '../types';

export const VTableQueries = {
    findPath(vTable: VTable, field?: VTableField, record?: VTableRecord): Path {
        const recordIndex = record && vTable.records().indexOf(record);
        const fieldIndex = field && vTable.fields().indexOf(field);
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1 && !isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [recordIndex!, fieldIndex!];
        }
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1) {
            return [recordIndex];
        }
        if (!isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [fieldIndex];
        }
        throw new Error(`Unable to find the path: ${JSON.stringify({ ...(field || {}), ...(record || {}) })}`);
    },
    getFieldValue(vTable: VTable, path: [RecordPath, FieldPath]): any {
        if (!vTable || !vTable.records() || !vTable.fields()) {
            throw new Error(`Cannot find a descendant at path [${path}]`);
        }
        const fieldId = vTable.fields()[path[1]].id;
        return vTable.records()[path[0]].value[fieldId];
    }
};
