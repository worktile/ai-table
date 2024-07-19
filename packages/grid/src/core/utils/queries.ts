import { isUndefinedOrNull } from 'ngx-tethys/util';
import { Path, AITable, AITableField, AITableRecord, AIFieldValuePath, AIRecordPath, AIFieldPath } from '../types';

export const AITableQueries = {
    findPath(aiTable: AITable, field?: AITableField, record?: AITableRecord): Path {
        const recordIndex = record && aiTable.records().indexOf(record);
        const fieldIndex = field && aiTable.fields().indexOf(field);
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1 && !isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [recordIndex!, fieldIndex!] as AIFieldValuePath;
        }
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1) {
            return [recordIndex] as AIRecordPath;
        }
        if (!isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [fieldIndex] as AIFieldPath;
        }
        throw new Error(`Unable to find the path: ${JSON.stringify({ ...(field || {}), ...(record || {}) })}`);
    },
    getFieldValue(aiTable: AITable, path: [number, number]): any {
        if (!aiTable || !aiTable.records() || !aiTable.fields()) {
            throw new Error(`Cannot find a descendant at path [${path}]`);
        }
        const fieldId = aiTable.fields()[path[1]].id;
        return aiTable.records()[path[0]].value[fieldId];
    }
};
