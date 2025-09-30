import { MoveFieldOptions, AITableViewField, sortByViewPosition } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { PositionsActions } from '../../action/position';
import { getCurrentViewPositions, ViewPositionOptions } from '../position-in-view';
import { buildSetFieldAction } from '../../action/field';

export function moveFields(aiTable: AIViewTable, options: MoveFieldOptions) {
    const viewPositionOptions: ViewPositionOptions = {
        afterItemId: options.afterFieldId,
        beforeItemId: options.beforeFieldId,
        count: options.fieldIds.length
    };
    let positions = getCurrentViewPositions(
        aiTable,
        viewPositionOptions,
        aiTable.fields() as AITableViewField[],
        aiTable.fieldsMap() as { [key: string]: AITableViewField }
    );
    if (positions.length === 0) {
        PositionsActions.resetAllFieldsPositions(aiTable);
        positions = getCurrentViewPositions(
            aiTable,
            viewPositionOptions,
            aiTable.fields() as AITableViewField[],
            aiTable.fieldsMap() as { [key: string]: AITableViewField }
        );
        console.log('Reset all fields positions');
    }
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId);
    const { fieldIds, afterFieldId, beforeFieldId } = options;
    const originalFields = aiTable.fields() as AITableViewField[];
    const fieldsIndexMap = new Map(originalFields.map((field, index) => [field._id, index]));
    const sourceFields: AITableViewField[] = [];
    fieldIds.forEach((id) => {
        const index = fieldsIndexMap.get(id);
        if (index === undefined) {
            throw new Error(`Field with id ${id} not found`);
        }
        sourceFields.push(originalFields[index] as AITableViewField);
    });

    const sortedSourceFields = sortByViewPosition(sourceFields, activeView!) as AITableViewField[];
    sortedSourceFields.forEach((field, index) => {
        const sourceIndex = fieldsIndexMap.get(field._id);
        if (sourceIndex === undefined) {
            throw new Error(`Field with id ${field._id} not found`);
        }
        const action = buildSetFieldAction(aiTable, { positions: { ...field.positions, [activeViewId]: positions[index] } }, [field._id]);
        if (action) {
            aiTable.apply(action);
        }
    });
}
