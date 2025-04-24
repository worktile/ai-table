import { AddFieldOptions, AITableField, AITableRecordUpdatedInfo, Direction, idsCreator } from '@ai-table/grid';
import { getSortFields } from './sort-fields';
import { AITableViewFields, AIViewTable } from '../../types';
import { Actions } from '../../action';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { originId, direction = Direction.after, defaultValue, isDuplicate, count = 1 } = options;
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    const fields = getSortFields(aiTable, aiTable.gridData().fields as AITableViewFields, activeView);
    let addIndex = fields.findIndex((item) => item._id === originId);
    if (direction === Direction.after) {
        addIndex++;
    }
    const newFieldIds = idsCreator(count);
    newFieldIds.forEach((id, index) => {
        const newField = { _id: id, ...defaultValue, positions: null } as AITableField;
        Actions.addField(aiTable, newField, [addIndex + index], options.originId, options.isCopy);
    });
    updateRecordsUpdatedInfo(aiTable, updatedInfo);
}
