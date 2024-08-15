import Konva from 'konva';
import { FieldHead } from '../components/field-head';
import { AITableIconType, Icon } from '../components/icon';
import { GRID_FIELD_HEAD_SELECT_CHECKBOX } from '../constants/config';
import { DefaultTheme } from '../constants/default-theme';
import { GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AITableUseHeads } from '../interface/view';

const getFieldHeadStatus = (fieldId: string, columnIndex: number) => {
    const iconVisible = true;
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

export const createHeads = (props: AITableUseHeads) => {
    const { context, instance, columnStartIndex, columnStopIndex } = props;
    const { fields } = context;

    const colors = DefaultTheme.colors;
    const { columnCount, frozenColumnWidth, frozenColumnCount, rowInitSize: fieldHeadHeight, autoHeadHeight } = instance;

    const getColumnHead = (columnStartIndex: number, columnStopIndex: number, isFrozen = false) => {
        const _fieldHeads: Konva.Group[] = [];

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = fields[columnIndex];
            if (field == null) continue;
            const x = instance.getColumnOffset(columnIndex);
            const columnWidth = instance.getColumnWidth(columnIndex);
            const { iconVisible, isHighlight, isSelected } = getFieldHeadStatus(field._id, columnIndex);

            const fieldHead = FieldHead({
                x,
                y: 0,
                width: columnWidth,
                height: fieldHeadHeight,
                field,
                columnIndex,
                stroke: columnIndex === 0 ? 'transparent' : undefined,
                iconVisible,
                isSelected,
                isHighlight,
                editable: true,
                isFrozen,
                autoHeadHeight
            });

            _fieldHeads.push(fieldHead);
        }
        return _fieldHeads;
    };

    /**
     * 绘制第一列标题
     */
    const frozenFieldHead = () => {
        const isChecked = false;
        const head = getColumnHead(0, frozenColumnCount - 1, true);
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
        const headBorder = new Konva.Rect({
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
        headGroup.push(rect, icon, ...head, headBorder);

        return headGroup;
    };

    /**
     * 绘制其他列标题
     */
    const fieldHeads = getColumnHead(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex);

    return {
        fieldHeads,
        frozenFieldHead
    };
};
