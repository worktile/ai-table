import { AITable, getDefaultFieldValue, isSystemField } from '../core';
import { UpdateFieldValueOptions } from '@ai-table/utils';
import { AITableActions } from './clipboard/paste';

export function clearCells(aiTable: AITable, actions: AITableActions): void {
    const selectedCells = aiTable.selection().selectedCells;
    if (selectedCells.size === 0) {
        return;
    }

    const fieldsMap = aiTable.fieldsMap();
    const defaultValues = new Map<string, any>();
    const updates: UpdateFieldValueOptions[] = [];

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

        updates.push({
            path: [recordId, fieldId],
            value: defaultValue
        });
    }

    if (updates.length > 0) {
        Promise.all(
            updates.map(
                (update) =>
                    new Promise<void>((resolve) => {
                        actions.updateFieldValue(update);
                        resolve();
                    })
            )
        );
    }
}
