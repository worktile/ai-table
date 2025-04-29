import { AddFieldOptions, AITableField, AITableRecordUpdatedInfo, Direction, idsCreator } from '@ai-table/grid';
import { getSortFields } from './sort-fields';
import { AITableViewFields, AIViewTable } from '../../types';
import { Actions } from '../../action';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { defaultValue, count = 1 } = options;
    const newFieldIds = idsCreator(count);
    newFieldIds.forEach((id) => {
        const newField = { _id: id, ...defaultValue, positions: null } as AITableField;
        Actions.addField(aiTable, newField, options.originId, options.isCopy);
    });
    updateRecordsUpdatedInfo(aiTable, updatedInfo);
}
