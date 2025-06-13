import { AITable, getDefaultFieldValue, isSystemField } from '../core';
import { AITableActions } from './clipboard/paste';

export function clearCells(aiTable: AITable, actions: AITableActions): void {
    const selectedCells = aiTable.selection().selectedCells;
    if (selectedCells.size === 0) {
        return;
    }

    const fieldsMap = aiTable.fieldsMap();

    for (const cellId of selectedCells) {
        const [recordId, fieldId] = cellId.split(':');
        if (!recordId || !fieldId) {
            continue;
        }

        const field = fieldsMap[fieldId];
        if (!field || isSystemField(field)) {
            continue;
        }

        actions.updateFieldValues([
            {
                path: [recordId, fieldId],
                value: getDefaultFieldValue(field)
            }
        ]);
    }
}
