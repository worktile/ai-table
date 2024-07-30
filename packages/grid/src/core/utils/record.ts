import { AITableFields, AITableRecord } from '../types';
import { getDefaultFieldValue } from './field';
import { idCreator } from './id-creator';

export function getDefaultRecord(fields: AITableFields) {
    const newRow: AITableRecord = {
        id: idCreator(),
        values: {}
    };
    fields.map((item) => {
        newRow.values[item.id] = getDefaultFieldValue(item.type);
    });
    return newRow;
}
