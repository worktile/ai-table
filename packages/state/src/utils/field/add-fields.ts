import { AddFieldOptions, AITableRecordUpdatedInfo, AITableViewField, AITableViewFields } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { Actions } from '../../action';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';
import { idCreator } from '@ai-table/grid';
import { createDefaultPositions, getPosition } from '../view';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { defaultValue, isDuplicate, isCopy } = options;
    const fields = aiTable.gridData().fields as AITableViewFields;
    const fieldsMap = aiTable.fieldsMap();
    const activeViewId = aiTable.activeViewId();
    const newField = { ...defaultValue } as AITableViewField;
    if (fieldsMap[newField._id]) {
        newField._id = idCreator();
    }
    if (isDuplicate) {
        const currentFieldIndex = fields.findIndex((item) => item._id === options.originId);
        newField.positions = {
            ...newField.positions,
            [activeViewId]: getPosition(fields, activeViewId, currentFieldIndex + 1)
        };
    } else {
        newField.positions = createDefaultPositions(aiTable.views(), aiTable.activeViewId(), fields, fields.length);
    }
    Actions.addField(aiTable, newField, options.originId, isCopy || isDuplicate);
    updateRecordsUpdatedInfo(aiTable, updatedInfo);
}
