import { AITableRecordUpdatedInfo, MoveFieldOptions, NumberPath } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import { Actions } from '../../action';

export function moveFields(aiTable: AIViewTable, options: MoveFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { path, newPath } = options;
    Actions.moveField(aiTable, path, newPath);
}
