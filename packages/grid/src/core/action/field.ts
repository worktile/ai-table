import { ActionName, AddFieldAction, FieldPath, VTable, VTableField } from '../types';

export function addField(vTable: VTable, field: VTableField, path: [FieldPath]) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    vTable.apply(operation);
}

export const FieldActions = {
    addField
};
