import { AddFieldOptions, AITableField, AITableRecordUpdatedInfo, idsCreator } from '@ai-table/grid';
import { AITableViewField, AIViewTable } from '../../types';
import { Actions } from '../../action';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';
import { getFieldNextPosition } from './position-field';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { defaultValue, count = 1 } = options;
    const newFieldIds = idsCreator(count);
    newFieldIds.forEach((id) => {
        const newField = { _id: id, ...defaultValue, positions: null } as AITableField;
        Actions.addField(aiTable, newField, options.originId, options.isCopy);
    });
    updateRecordsUpdatedInfo(aiTable, updatedInfo);
}

export function addCopyFields(aiTable: AIViewTable, options: AddFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { defaultValue, count = 1 } = options;
    const newFieldIds = idsCreator(count);
    let currentPosition = (defaultValue as AITableViewField).positions[aiTable.activeViewId()];
    const fieldNextPosition = getFieldNextPosition(aiTable, options.originId);
    let nextPosition = (currentPosition + fieldNextPosition) / 2;
    newFieldIds.forEach((id) => {
        const newField = { _id: id, ...defaultValue } as AITableViewField;
        newField.positions[aiTable.activeViewId()] = nextPosition;
        currentPosition = nextPosition;
        nextPosition = (currentPosition + fieldNextPosition) / 2;
        Actions.addField(aiTable, newField, options.originId, options.isCopy);
    });
    updateRecordsUpdatedInfo(aiTable, updatedInfo);
}
