import { isUndefinedOrNull } from 'ngx-tethys/util';
import { AITable, AITableField, AITableRecord, AIFieldValuePath, AIRecordPath, AIFieldPath } from '../types';

export const AITableQueries = {
    findRecordPath(aiTable: AITable, record: AITableRecord) {
        const recordIndex = record && aiTable.records().indexOf(record);
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1) {
            return [recordIndex] as AIRecordPath;
        }
        throw new Error(`can not find the record path: ${JSON.stringify({ ...(record || {}) })}`);
    },
    findFieldPath(aiTable: AITable, field: AITableField) {
        const fieldIndex = field && aiTable.fields().indexOf(field);
        if (!isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [fieldIndex] as AIFieldPath;
        }
        throw new Error(`can not find the field path: ${JSON.stringify({ ...(field || {}) })}`);
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
