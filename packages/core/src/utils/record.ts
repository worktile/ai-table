import { VTableFields, VTableRecord } from '../types';
import { getDefaultFiledValue } from './field';
import { idCreator } from './id-creator';

export function getDefaultRecord(fields: VTableFields) {
    const newRow: VTableRecord = {
        id: idCreator(),
        value: {}
    };
    fields.map((item) => {
        newRow.value[item.id] = getDefaultFiledValue(item.type);
    });
    return newRow;
}
