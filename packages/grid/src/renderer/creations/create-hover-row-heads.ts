import Konva from 'konva';
import { AITable } from '../../core';
import { generateTargetName, getDetailByTargetName } from '../../utils';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ROW_HEAD,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_SELECT_CHECKBOX
} from '../../constants';
import { AITableAreaType, AITableCheckType, AITableRowHeadOperationOptions, AITableRowHeadsOptions, AITableRowType } from '../../types';
import { createIcon } from './create-icon';

export const createRowHeadOperation = (options: AITableRowHeadOperationOptions) => {
    const { instance, isCheckedRow, isHoverRow, rowIndex, recordId, isHoverCheckbox } = options;
    const y = instance.getRowOffset(rowIndex);
    const colors = AITable.getColors();
    const group = new Konva.Group({ x: 0, y });
    const rect = new Konva.Rect({
        name: generateTargetName({ targetName: AI_TABLE_ROW_HEAD, recordId }),
        width: AI_TABLE_ROW_HEAD_WIDTH + 1,
        height: instance.rowHeight,
        fill: colors.transparent
    });

    group.add(rect);
    if (isCheckedRow || isHoverRow) {
        const iconOffsetY = (AI_TABLE_FIELD_HEAD_HEIGHT - 16) / 2;
        const innerGroup = new Konva.Group();
        const icon = createIcon({
            name: generateTargetName({
                targetName: AI_TABLE_ROW_SELECT_CHECKBOX,
                recordId
            }),
            x: AI_TABLE_CELL_PADDING,
            y: iconOffsetY + 1,
            type: isCheckedRow ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill: isCheckedRow ? colors.primary : colors.gray300,
            stroke: isHoverCheckbox || isCheckedRow ? colors.primary : colors.gray300
        });
        innerGroup.add(icon);
        group.add(innerGroup);
    }
    return group;
};

export const createHoverRowHeads = (options: AITableRowHeadsOptions) => {
    const { instance, rowStartIndex, rowStopIndex, context, aiTable } = options;
    const hoverRowHeads = [];
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > instance.rowCount - 1) break;
        const row = context.linearRows()[rowIndex];
        if (row == null) continue;
        const { type, _id: recordId } = row;
        if (type !== AITableRowType.record || recordId == null) continue;
        const { areaType, rowIndex: pointRowIndex, realTargetName } = context.pointPosition();
        const isCheckedRow = aiTable.selection().selectedRecords.has(recordId);
        if (!isCheckedRow && areaType === AITableAreaType.none) continue;
        const { type: pointRowType, _id: pointRecordId } = context.linearRows()[pointRowIndex];
        const isHoverRow = recordId === pointRecordId && pointRowType === AITableRowType.record;
        const isHoverCheckbox = getDetailByTargetName(realTargetName).targetName === AI_TABLE_ROW_SELECT_CHECKBOX;
        const operationGroup = createRowHeadOperation({ instance, isCheckedRow, isHoverRow, recordId, rowIndex, isHoverCheckbox });
        hoverRowHeads.push(operationGroup);
    }
    return hoverRowHeads;
};
