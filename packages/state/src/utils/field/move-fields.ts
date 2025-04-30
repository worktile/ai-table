import { AITableRecordUpdatedInfo, MoveFieldOptions } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { Actions } from '../../action';

export function moveFields(aiTable: AIViewTable, options: MoveFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { path, newPath } = options;
    Actions.moveField(aiTable, path, newPath);
}
