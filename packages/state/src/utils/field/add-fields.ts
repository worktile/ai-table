import { AddFieldOptions, AITableFieldOption, AITableViewField, AITableViewFields, idCreator } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { Actions } from '../../action';
import { getNewItemsPosition, ViewPositionOptions } from '../position-in-view';
import { PositionsActions } from '../../action/position';
import { generateNewFieldName, getI18nTextByKey, AITableGridI18nKey } from '@ai-table/grid';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions) {
    const maxFieldsCount = aiTable.context?.maxFields();
    if (maxFieldsCount && aiTable.fields().length >= maxFieldsCount) {
        console.log(`Warning: ${getI18nTextByKey(aiTable, AITableGridI18nKey.pasteOverMaxRecords)}`);
        return;
    }

    const { defaultValue, isDuplicate, originId } = options;
    const fieldsMap = aiTable.fieldsMap();
    const newField = { ...defaultValue } as AITableViewField;

    const existNames = aiTable.fields().map((item) => item.name);
    if (existNames.includes(newField.name)) {
        newField.name = generateNewFieldName(aiTable, newField as Pick<AITableFieldOption, 'type' | 'settings'>, newField.name);
    }

    if (fieldsMap[newField._id]) {
        newField._id = idCreator();
    }

    const viewPositionOptions: ViewPositionOptions = { count: options.count || 1 };
    if (options.beforeItemId) {
        viewPositionOptions.beforeItemId = options.beforeItemId;
    } else if (options.afterItemId) {
        viewPositionOptions.afterItemId = options.afterItemId;
    } else if (isDuplicate) {
        viewPositionOptions.afterItemId = originId;
    }
    let positions = getNewItemsPosition(
        aiTable,
        viewPositionOptions,
        aiTable.fields() as AITableViewFields,
        aiTable.fieldsMap() as { [key: string]: AITableViewField }
    );
    if (positions.length === 0) {
        PositionsActions.resetAllFieldsPositions(aiTable);
        positions = getNewItemsPosition(
            aiTable,
            viewPositionOptions,
            aiTable.fields() as AITableViewFields,
            aiTable.fieldsMap() as { [key: string]: AITableViewField }
        );
    }
    newField.positions = positions[0];
    Actions.addField(aiTable, newField, originId, isDuplicate);
}
