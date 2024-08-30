import Konva from 'konva';
import { AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX, AI_TABLE_ICON_COMMON_SIZE, AI_TABLE_ROW_HEAD_WIDTH, Colors } from '../constants';
import { createFieldHead } from './field-head';
import { createIcon } from './icon';
import { AITableCheckType, AITableCreateHeadsOptions } from '../types';

export const createColumnHeads = (props: AITableCreateHeadsOptions) => {
    const { fields, instance, columnStartIndex, columnStopIndex } = props;
    const colors = Colors;
    const { columnCount, frozenColumnWidth, frozenColumnCount, rowInitSize: fieldHeadHeight } = instance;

    const getColumnHead = (columnStartIndex: number, columnStopIndex: number) => {
        const _fieldHeads: Konva.Group[] = [];
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = fields[columnIndex];
            if (field == null) continue;
            const x = instance.getColumnOffset(columnIndex);
            const columnWidth = instance.getColumnWidth(columnIndex);
            const fieldHead = createFieldHead({
                x,
                y: 0,
                width: columnWidth,
                height: fieldHeadHeight,
                field,
                stroke: columnIndex === 0 ? 'transparent' : undefined
            });

            _fieldHeads.push(fieldHead);
        }
        return _fieldHeads;
    };

    const getFrozenColumnHead = () => {
        const isChecked = false;
        const head = getColumnHead(0, frozenColumnCount - 1);
        const headGroup = [];
        const topLine = new Konva.Line({
            x: 0.5,
            y: 0.5,
            points: [0, 0, AI_TABLE_ROW_HEAD_WIDTH, 0],
            stroke: colors.gray200,
            strokeWidth: 1,
            listening: false
        });
        const bottomLine = new Konva.Line({
            x: 0.5,
            y: 0.5,
            points: [AI_TABLE_ROW_HEAD_WIDTH, fieldHeadHeight, 0, fieldHeadHeight],
            stroke: colors.gray200,
            strokeWidth: 1,
            listening: false
        });
        const icon = createIcon({
            name: AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
            x: 28,
            y: (fieldHeadHeight - AI_TABLE_ICON_COMMON_SIZE) / 2,
            type: isChecked ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill: isChecked ? colors.primary : colors.gray300
        });
        const rect1 = new Konva.Rect({
            x: AI_TABLE_ROW_HEAD_WIDTH + 0.5,
            y: 0.5,
            width: frozenColumnWidth,
            height: fieldHeadHeight,
            stroke: colors.gray200,
            strokeWidth: 1,
            fill: 'transparent',
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
