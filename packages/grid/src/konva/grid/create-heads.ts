import { AITable } from '@ai-table/grid';
import Konva from 'konva';
import { FieldHead } from '../components/field-head';
import { AITableIconType, Icon } from '../components/icon';
import { GRID_FIELD_HEAD, GRID_FIELD_HEAD_DESC, GRID_FIELD_HEAD_MORE, GRID_FIELD_HEAD_SELECT_CHECKBOX } from '../constants/config';
import { GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AITableUseHeads } from '../interface/view';

export const createHeads = (config: AITableUseHeads) => {
    const { context, instance, columnStartIndex, columnStopIndex } = config;
    const { aiTable, fields, pointPosition } = context;
    const { columnCount, frozenColumnWidth, frozenColumnCount, rowInitSize: fieldHeadHeight } = instance;
    const colors = AITable.getThemeColors(aiTable());
    const { columnIndex: pointColumnIndex, targetName: pointTargetName } = pointPosition();
    const pointFieldId = fields()[pointColumnIndex]?._id;

    const getFieldHeadStatus = (fieldId: string, columnIndex: number) => {
        const iconVisible =
            [GRID_FIELD_HEAD_DESC, GRID_FIELD_HEAD, GRID_FIELD_HEAD_MORE].includes(pointTargetName) && pointFieldId === fieldId;
        const isFilterField = false;
        const isSortField = false;
        const isHighlight = isFilterField || isSortField;
        const isSelected = false;

        return {
            iconVisible,
            isHighlight,
            isSelected
        };
    };

    const getColumnHead = (columnStartIndex: number, columnStopIndex: number, isFrozen = false) => {
        const _fieldHeads: Konva.Group[] = [];

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = fields()[columnIndex];
            const fieldId = field._id;
            if (field == null) continue;
            const x = instance.getColumnOffset(columnIndex);
            const columnWidth = instance.getColumnWidth(columnIndex);
            const { iconVisible, isHighlight, isSelected } = getFieldHeadStatus(fieldId, columnIndex);

            const fieldHead = FieldHead({
                x,
                y: 0,
                width: columnWidth,
                height: fieldHeadHeight,
                field,
                columnIndex,
                stroke: columnIndex === 0 ? 'transparent' : undefined,
                isFrozen,
                iconVisible,
                isHighlight,
                isSelected,
                editable: true,
                autoHeadHeight: false
            });

            _fieldHeads.push(fieldHead);
        }
        return _fieldHeads;
    };

    /**
     * 绘制第一列标题
     */
    const frozenFieldHead = (() => {
        const isChecked = false;
        const head = getColumnHead(0, frozenColumnCount - 1);
        const headGroup = [];

        const rect = new Konva.Rect({
            x: 0.5,
            y: 0.5,
            width: GRID_ROW_HEAD_WIDTH + 1,
            height: fieldHeadHeight,
            fill: colors.defaultBg,
            cornerRadius: [8, 0, 0, 0],
            listening: false
        });
        const icon = Icon({
            name: GRID_FIELD_HEAD_SELECT_CHECKBOX,
            x: 28,
            y: (fieldHeadHeight - GRID_ICON_COMMON_SIZE) / 2,
            type: isChecked ? AITableIconType.checked : AITableIconType.unchecked,
            fill: isChecked ? colors.primaryColor : colors.thirdLevelText
        });
        const rect1 = new Konva.Rect({
            x: 0.5,
            y: 0.5,
            width: frozenColumnWidth + GRID_ROW_HEAD_WIDTH,
            height: fieldHeadHeight,
            stroke: colors.sheetLineColor,
            strokeWidth: 1,
            fill: 'transparent',
            cornerRadius: [8, 0, 0, 0],
            listening: false
        });
        headGroup.push(rect, icon, ...head, rect1);

        return headGroup;
    })();

    /**
     * 绘制其他列标题
     */
    const fieldHeads = getColumnHead(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex);

    return {
        fieldHeads,
        frozenFieldHead
    };
};
