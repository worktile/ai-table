import { AITableFields, AITableRecord } from '../types';
import { getDefaultFieldValue } from './field';
import { idCreator } from './id-creator';

export function getDefaultRecord(fields: AITableFields) {
    const newRow: AITableRecord = {
        id: idCreator(),
        value: {}
    };
    fields.map((item) => {
        newRow.value[item.id] = getDefaultFieldValue(item.type);
    });
    return newRow;
}
