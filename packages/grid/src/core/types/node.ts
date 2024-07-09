import { isUndefinedOrNull } from 'ngx-tethys/util';
import { FieldPath, Path, RecordPath } from './action';
import { VTable, VTableField, VTableRecord } from './core';

export const VTableNode = {
    findPath(root: VTable, field?: VTableField, record?: VTableRecord): Path {
        const recordIndex = record && root.records().indexOf(record);
        const fieldIndex = field && root.fields().indexOf(field);
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
    get(root: VTable, path: [RecordPath, FieldPath]): any {
        if (!root || !root.records() || !root.fields()) {
            throw new Error(`Cannot find a descendant at path [${path}]`);
        }
        const fieldId = root.fields()[path[1]].id;
        return root.records()[path[0]].value[fieldId];
    }
};
