import { AddFieldOptions, AITableViewField, AITableViewFields, idCreator } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { Actions } from '../../action';
import { getNewItemsPosition, ViewPositionOptions } from '../position-in-view';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions) {
    const { defaultValue, isDuplicate, originId } = options;
    const fieldsMap = aiTable.fieldsMap();
    const newField = { ...defaultValue } as AITableViewField;

    if (fieldsMap[newField._id]) {
        newField._id = idCreator();
    }
    const viewPositionOptions: ViewPositionOptions = { count: options.count || 1 };
    if (isDuplicate) {
        viewPositionOptions.afterItemId = originId;
    }
    let positions = getNewItemsPosition(
        aiTable,
        viewPositionOptions,
        aiTable.fields() as AITableViewFields,
        aiTable.fieldsMap() as { [key: string]: AITableViewField }
    );
    if (positions.length === 0) {
        // TODO: reset all fields positions
    }
    newField.positions = positions[0];
    Actions.addField(aiTable, newField, originId, isDuplicate);
}
