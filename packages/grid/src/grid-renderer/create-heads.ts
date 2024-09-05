import Konva from 'konva';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_HEAD_WIDTH,
    Colors
} from '../constants';
import { createFieldHead } from './field-head';
import { createIcon } from './icon';
import { AITableCheckType, AITableCreateHeadsOptions } from '../types';

export const createColumnHeads = (props: AITableCreateHeadsOptions) => {
    const { fields, instance, columnStartIndex, columnStopIndex, pointPosition, aiTable } = props;
    const colors = Colors;
    const { columnCount, frozenColumnWidth, frozenColumnCount, rowInitSize: fieldHeadHeight } = instance;
    const { columnIndex: pointColumnIndex, targetName: pointTargetName } = pointPosition;

    const getFieldHeadStatus = (fieldId: string) => {
        const iconVisible =
            [AI_TABLE_FIELD_HEAD, AI_TABLE_FIELD_HEAD_MORE].includes(pointTargetName) && fields[pointColumnIndex]?._id === fieldId;
        return {
            iconVisible
        };
    };

    const getColumnHead = (columnStartIndex: number, columnStopIndex: number) => {
        const _fieldHeads: Konva.Group[] = [];
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = fields[columnIndex];
            if (field == null) continue;
            const x = instance.getColumnOffset(columnIndex);
            const columnWidth = instance.getColumnWidth(columnIndex);
            const { iconVisible } = getFieldHeadStatus(field._id);
            const fieldHead = createFieldHead({
                x,
                y: 0,
                width: columnWidth,
                height: fieldHeadHeight,
                field,
                stroke: columnIndex === 0 ? colors.transparent : undefined,
                iconVisible
            });

            _fieldHeads.push(fieldHead);
        }
        return _fieldHeads;
    };

    const getFrozenColumnHead = () => {
        const isChecked = aiTable.selection().selectedRecords.size === aiTable.records().length;
        const head = getColumnHead(0, frozenColumnCount - 1);
        const headGroup = [];
        const topLine = new Konva.Line({
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            points: [0, 0, AI_TABLE_ROW_HEAD_WIDTH, 0],
            stroke: colors.gray200,
            strokeWidth: 1,
            listening: false
        });
        const bottomLine = new Konva.Line({
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            points: [AI_TABLE_ROW_HEAD_WIDTH, fieldHeadHeight, 0, fieldHeadHeight],
            stroke: colors.gray200,
            strokeWidth: 1,
            listening: false
        });
        const icon = createIcon({
            name: AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
            x: AI_TABLE_CELL_PADDING,
            y: (fieldHeadHeight - AI_TABLE_ICON_COMMON_SIZE) / 2,
            type: isChecked ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill: isChecked ? colors.primary : colors.gray300
        });
        const rect1 = new Konva.Rect({
            x: AI_TABLE_ROW_HEAD_WIDTH + AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width: frozenColumnWidth,
            height: fieldHeadHeight,
            stroke: colors.gray200,
            strokeWidth: 1,
            fill: colors.transparent,
            listening: false
        });
        headGroup.push(topLine, bottomLine, icon, ...head, rect1);

        return headGroup;
    };

    /**
     * 绘制其他列标题
     */
    const columnHeads = getColumnHead(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex);

    const frozenColumnHead = getFrozenColumnHead();

    return {
        columnHeads,
        frozenColumnHead
    };
};
