import { AddFieldOptions, AITableViewField, AITableViewFields, idCreator } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { Actions } from '../../action';
import { createPositions, getPosition } from '../view';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions) {
    const { defaultValue, isDuplicate, originId } = options;
    const fields = aiTable.gridData().fields as AITableViewFields;
    const fieldsMap = aiTable.fieldsMap();
    const activeViewId = aiTable.activeViewId();
    const newField = { ...defaultValue } as AITableViewField;

    if (fieldsMap[newField._id]) {
        newField._id = idCreator();
    }
    if (isDuplicate) {
        const currentFieldIndex = fields.findIndex((item) => item._id === originId);
        newField.positions = {
            ...newField.positions,
            [activeViewId]: getPosition(fields, activeViewId, currentFieldIndex)
        };
    } else {
        newField.positions = createPositions(
            aiTable.views(),
            aiTable.activeViewId(),
            aiTable.gridData().fields as AITableViewFields,
            fields.length
        );
    }
    Actions.addField(aiTable, newField, originId, isDuplicate);
}
