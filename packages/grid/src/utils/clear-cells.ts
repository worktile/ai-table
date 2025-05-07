import { AITable, getDefaultFieldValue, isSystemField } from '../core';
import { AITableActions } from './clipboard/paste';

export function clearCells(aiTable: AITable, actions: AITableActions): void {
    const selectedCells = aiTable.selection().selectedCells;
    if (selectedCells.size === 0) {
        return;
    }

    const fieldsMap = aiTable.fieldsMap();
    const defaultValues = new Map<string, any>();

    for (const cellId of selectedCells) {
        const [recordId, fieldId] = cellId.split(':');
        if (!recordId || !fieldId) {
            continue;
        }

        const field = fieldsMap[fieldId];
        if (!field || isSystemField(field)) {
            continue;
        }

        let defaultValue = defaultValues.get(fieldId);
        if (defaultValue === undefined) {
            defaultValue = getDefaultFieldValue(field);
            defaultValues.set(fieldId, defaultValue);
        }

        actions.updateFieldValue({
            path: [recordId, fieldId],
            value: defaultValue
        });
    }
}
