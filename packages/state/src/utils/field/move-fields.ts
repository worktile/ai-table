import { MoveFieldOptions, AITableViewField, sortByViewPosition, AITableAction } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { PositionsActions } from '../../action/position';
import { getCurrentViewPositions, ViewPositionOptions } from '../position-in-view';
import { buildSetFieldAction } from '../../action/field';
import { getFrozenFieldId } from './frozen-field';
import { ViewActions } from '../../action/view';

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
            return;
        }
        sourceFields.push(originalFields[index] as AITableViewField);
    });

    const sortedSourceFields = sortByViewPosition(sourceFields, activeView!) as AITableViewField[];
    const actions: AITableAction[] = [];
    sortedSourceFields.forEach((field, index) => {
        const action = buildSetFieldAction(aiTable, { positions: { ...field.positions, [activeViewId]: positions[index] } }, [field._id]);
        if (action) {
            actions.push(action);
        }
    });
    const currentFrozenFieldId = getFrozenFieldId(aiTable);
    if (currentFrozenFieldId) {
        adjustFrozenFieldAfterMove(aiTable, currentFrozenFieldId, sortedSourceFields[0]._id, {
            afterFieldId,
            beforeFieldId
        });
    }
    aiTable.apply(actions);
}

function adjustFrozenFieldAfterMove(
    aiTable: AIViewTable,
    currentFrozenFieldId: string,
    sourceFieldId: string,
    fieldOptions: { afterFieldId?: string; beforeFieldId?: string }
) {
    const fields = aiTable.gridData().fields;
    const fieldsIndexMap = new Map(fields.map((field, index) => [field._id, index]));
    const currentFrozenFieldIndex = fieldsIndexMap.get(currentFrozenFieldId)! as number;

    if (currentFrozenFieldIndex === -1) {
        return;
    }

    const { afterFieldId, beforeFieldId } = fieldOptions;
    const sourceIndex = fieldsIndexMap.get(sourceFieldId)!;
    let targetIndex: number | undefined;
    if (beforeFieldId) {
        targetIndex = fieldsIndexMap.get(beforeFieldId);
    } else if (afterFieldId) {
        targetIndex = fieldsIndexMap.get(afterFieldId);
    } else {
        return;
    }

    const activeViewId = aiTable.activeViewId();

    // 最后冻结列拖动到非冻结区或冻结区，冻结列向左移动
    if (sourceIndex === currentFrozenFieldIndex && targetIndex !== currentFrozenFieldIndex) {
        const newFrozenFieldIndex = Math.max(0, currentFrozenFieldIndex - 1);
        if (newFrozenFieldIndex < fields.length && newFrozenFieldIndex !== currentFrozenFieldIndex) {
            const newFrozenField = fields[newFrozenFieldIndex];
            ViewActions.setView(
                aiTable,
                { settings: { ...aiTable.viewsMap()[activeViewId].settings, frozen_field_id: newFrozenField._id } },
                [activeViewId]
            );
        } else {
            // 如果没有前一个字段，恢复默认冻结
            ViewActions.setView(aiTable, { settings: { ...aiTable.viewsMap()[activeViewId].settings, frozen_field_id: undefined } }, [
                activeViewId
            ]);
        }
    }

    // 冻结区拖动到最后冻结列后面，冻结列是被拖动列
    if (sourceIndex < currentFrozenFieldIndex && targetIndex === currentFrozenFieldIndex) {
        const newFrozenField = fields[sourceIndex];
        ViewActions.setView(aiTable, { settings: { ...aiTable.viewsMap()[activeViewId].settings, frozen_field_id: newFrozenField._id } }, [
            activeViewId
        ]);
    }
}
