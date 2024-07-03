import { ActionName, FieldPath, RecordPath, UpdateFieldValueAction, VTable, VTableNode } from '../types';

export function updateFieldValue(vTable: VTable, props: { value: any }, path: [RecordPath, FieldPath]) {
    const node = VTableNode.get(vTable, path);
    if (node !== props.value) {
        const properties = {
            value: node
        };
        const newProperties = props;
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
            properties,
            newProperties,
            path
        };
        vTable.apply(operation);
    }
}

export const FieldActions = {
    updateFieldValue
};
