import { AITable, isSystemField } from '../core';
import { AITableActions } from './clipboard/paste';
import { FieldModelMap } from './field';

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

        const defaultValue = FieldModelMap[field.type].getDefaultValue();
        actions.updateFieldValues([
            {
                path: [recordId, fieldId],
                value: defaultValue
            }
        ]);
    }
}
