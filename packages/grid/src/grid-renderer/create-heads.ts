import Konva from 'konva';
import {
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_ROW_HEAD_WIDTH,
    Colors,
    DEFAULT_COLUMN_WIDTH
} from '../constants';
import { createFieldHead } from './field-head';
import { createIcon } from './icon';
import { AITableCheckType, AITableCreateHeadsOptions } from '../types';
import { AITableField } from '../core/types';

export const createHeads = (props: AITableCreateHeadsOptions) => {
    const { fields, instance, columnStartIndex, columnStopIndex } = props;
    const colors = Colors;
    const { columnCount, frozenColumnWidth, frozenColumnCount, rowInitSize: fieldHeadHeight } = instance;

    const getFieldHeadStatus = (field: AITableField, columnIndex: number) => {
        const iconVisible = false;
        const isSelected = false;
        return {
            iconVisible,
            isSelected
        };
    };

    const getColumnHead = (columnStartIndex: number, columnStopIndex: number, isFrozen = false) => {
        const _fieldHeads: Konva.Group[] = [];
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = fields[columnIndex];
            if (field == null) continue;
            const x = instance.getColumnOffset(columnIndex);
            const columnWidth = instance.getColumnWidth(columnIndex) ?? DEFAULT_COLUMN_WIDTH;
            const { iconVisible, isSelected } = getFieldHeadStatus(field, columnIndex);
            const fieldHead = createFieldHead({
                x,
                y: 0,
                width: columnWidth,
                height: fieldHeadHeight,
                field,
                stroke: columnIndex === 0 ? 'transparent' : undefined,
                isSelected: isSelected,
                operationVisible: iconVisible
            });

            _fieldHeads.push(fieldHead);
        }
        return _fieldHeads;
    };

    /**
     * 绘制第一列标题
     */
    const getFrozenFieldHead = () => {
        const isChecked = false;
        const head = getColumnHead(0, frozenColumnCount - 1, true);
        const headGroup = [];
        const rect = new Konva.Rect({
            x: 0.5,
            y: 0.5,
            width: AI_TABLE_ROW_HEAD_WIDTH + 1,
            height: fieldHeadHeight,
            fill: colors.defaultBackground,
            cornerRadius: [8, 0, 0, 0],
            listening: false
        });
        const icon = createIcon({
            name: AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
            x: 28,
            y: (fieldHeadHeight - AI_TABLE_ICON_COMMON_SIZE) / 2,
            type: isChecked ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill: isChecked ? colors.primary : colors.defaultIconFill
        });
        const rect1 = new Konva.Rect({
            x: 0.5,
            y: 0.5,
            width: frozenColumnWidth + AI_TABLE_ROW_HEAD_WIDTH,
            height: fieldHeadHeight,
            stroke: colors.sheetLineColor,
            strokeWidth: 1,
            fill: 'transparent',
            cornerRadius: [8, 0, 0, 0],
            listening: false
        });
        headGroup.push(rect, icon, ...head, rect1);

        return headGroup;
    };

    /**
     * 绘制其他列标题
     */
    const fieldHeads = getColumnHead(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex);

    const frozenFieldHead = getFrozenFieldHead();

    return {
        fieldHeads,
        frozenFieldHead
    };
};
