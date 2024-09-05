import Konva from 'konva';
import { AITable } from '../../core';
import { generateTargetName, getDetailByTargetName } from '../../utils';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ROW_HEAD,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_SELECT_CHECKBOX
} from '../../constants';
import { AITableAreaType, AITableCheckType, AITableRowHeadOperationOptions, AITableRowHeadsOptions, AITableRowType } from '../../types';
import { createIcon } from './create-icon';
import { Group } from 'konva/lib/Group';

export const createRowHeadOperation = (options: AITableRowHeadOperationOptions) => {
    const { instance, isCheckedRow, rowIndex, recordId } = options;
    const y = instance.getRowOffset(rowIndex);
    const colors = AITable.getColors();
    const group = new Konva.Group({ x: 0, y });
    const rect = new Konva.Rect({
        name: generateTargetName({ targetName: AI_TABLE_ROW_HEAD, recordId }),
        width: AI_TABLE_ROW_HEAD_WIDTH + 1,
        height: instance.rowHeight,
        fill: colors.transparent
    });
    const iconOffsetY = (AI_TABLE_FIELD_HEAD_HEIGHT - 16) / 2;
    const icon = createIcon({
        name: generateTargetName({
            targetName: AI_TABLE_ROW_SELECT_CHECKBOX,
            recordId
        }),
        x: AI_TABLE_CELL_PADDING,
        y: iconOffsetY + 1,
        type: isCheckedRow ? AITableCheckType.checked : AITableCheckType.unchecked,
        fill: isCheckedRow ? colors.primary : colors.gray300
        // stroke: isHoverCheckbox && !isCheckedRow ? colors.primary : colors.transparent
    });
    group.add(rect);
    group.add(icon);
    return group;
};

export const createHoverRowHeads = (options: AITableRowHeadsOptions) => {
    const { instance, rowStartIndex, rowStopIndex, context, aiTable } = options;
    const hoverRowHeads: Group[] = [];

    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > instance.rowCount - 1) break;
        const row = context.linearRows()[rowIndex];
        if (row == null) continue;
        const { type, _id: recordId } = row;
        if (type !== AITableRowType.record || recordId == null) continue;
        const isCheckedRow = aiTable.selection().selectedRecords.has(recordId);
        const { areaType, rowIndex: pointRowIndex, realTargetName, targetName } = context.pointPosition();
        if (!isCheckedRow && areaType === AITableAreaType.none) continue;
        let isHoverRow;
        if (pointRowIndex > -1) {
            const { type: pointRowType, _id: pointRecordId } = context.linearRows()[pointRowIndex];
            isHoverRow = recordId === pointRecordId && pointRowType === AITableRowType.record && targetName !== AI_TABLE_FIELD_HEAD;
        }
        if (isCheckedRow || isHoverRow) {
            const isHoverCheckbox = getDetailByTargetName(realTargetName).targetName === AI_TABLE_ROW_SELECT_CHECKBOX;
            const operationGroup = createRowHeadOperation({ instance, isCheckedRow, recordId, rowIndex, isHoverCheckbox });
            hoverRowHeads.push(operationGroup);
        }
    }

    return hoverRowHeads;
};
