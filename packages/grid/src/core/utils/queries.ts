import { isUndefinedOrNull } from 'ngx-tethys/util';
import { Path, AITable, AITableField, AITableRecord, AIFieldValuePath, AIRecordPath, AIFieldPath } from '../types';

export const AITableQueries = {
    findPath(aiTable: AITable, field?: AITableField, record?: AITableRecord): Path {
        const recordIndex = record && aiTable.records().indexOf(record);
        const fieldIndex = field && aiTable.fields().indexOf(field);
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1 && !isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [aiTable.records()[recordIndex]._id!, aiTable.fields()[fieldIndex]._id!] as AIFieldValuePath;
        }
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1) {
            return [recordIndex] as AIRecordPath;
        }
        if (!isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [fieldIndex] as AIFieldPath;
        }
        throw new Error(`can not find the path: ${JSON.stringify({ ...(field || {}), ...(record || {}) })}`);
    },
    getFieldValue(aiTable: AITable, path: AIFieldValuePath): any {
        if (!aiTable) {
            throw new Error(`aiTable does not exist`);
        }
        if (!aiTable.records()) {
            throw new Error(`aiTable has no records`);
        }
        if (!aiTable.fields()) {
            throw new Error(`aiTable has no fields`);
        }
        if (!path) {
            throw new Error(`path does not exist as path [${path}]`);
        }
        const recordIndex = aiTable.records().findIndex((item) => item._id === path[0]);
        if (recordIndex < 0) {
            throw new Error(`can not find record at path [${path}]`);
        }
        return aiTable.records()[recordIndex].values[path[1]];
    },

    getField(aiTable: AITable, path: AIFieldPath): AITableField {
        if (!aiTable) {
            throw new Error(`aiTable does not exist`);
        }
        if (!path) {
            throw new Error(`path does not exist as path [${path}]`);
        }
        return aiTable.fields()[path[0]];
    },

    getRecord(aiTable: AITable, path: AIRecordPath): AITableRecord {
        if (!aiTable) {
            throw new Error(`aiTable does not exist`);
        }
        if (!path) {
            throw new Error(`path does not exist as path [${path}]`);
        }
        return aiTable.records()[path[0]];
    }
};
