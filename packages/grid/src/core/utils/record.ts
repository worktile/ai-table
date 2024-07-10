import { AITableFields, AITableRecord } from '../types';
import { getDefaultFiledValue } from './field';
import { idCreator } from './id-creator';

export function getDefaultRecord(fields: AITableFields) {
    const newRow: AITableRecord = {
        id: idCreator(),
        value: {}
    };
    fields.map((item) => {
        newRow.value[item.id] = getDefaultFiledValue(item.type);
    });
    return newRow;
}
