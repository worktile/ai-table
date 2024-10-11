import { AddFieldOptions, AITableField, Direction } from '@ai-table/grid';
import { getSortFields } from './sort-fields';
import { AITableViewFields, AIViewTable } from '../../types';
import { getNewIdsByCount } from '../common';
import { Actions } from '../../action';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions) {
    const { fieldId, direction = Direction.after, fieldValue, isDuplicate, count = 1 } = options;
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    const fields = getSortFields(aiTable, aiTable.fields() as AITableViewFields, activeView);
    let addIndex = fields.findIndex((item) => item._id === fieldId);
    if (direction === Direction.after) {
        addIndex++;
    }
    const newRecordIds = getNewIdsByCount(count);
    newRecordIds.forEach((id, index) => {
        const newField = { _id: id, ...fieldValue } as AITableField;
        Actions.addField(aiTable, newField, [addIndex + index]);
    });
}
