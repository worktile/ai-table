import { AITableField } from '@ai-table/grid';
import Konva from 'konva';
import { Text } from '../../components/text';
import { GRID_FIELD_HEAD } from '../../constants/config';
import { DefaultTheme } from '../../constants/default-theme';
import { FIELD_HEAD_ICON_GAP_SIZE, FIELD_HEAD_TEXT_MIN_WIDTH, GRID_CELL_VALUE_PADDING, GRID_ICON_COMMON_SIZE } from '../../constants/grid';
import { autoSizerCanvas } from '../../utils/auto-size-canvas';
import { generateTargetName } from '../../utils/helper';
import { FieldIcon } from './field-icon';

interface AITableFieldHeadConfig {
    x?: number;
    y?: number;
    width: number;
    height: number;
    field: AITableField;
    columnIndex: number;
    stroke?: string;
}

export const FieldHead = (config: AITableFieldHeadConfig) => {
    const { x = 0, y = 0, width, field, height: headHeight, stroke } = config;

    const textSizer = autoSizerCanvas;
    const colors = DefaultTheme.colors;
    const { id: fieldId, name: _fieldName } = field;
    const textOffset = GRID_CELL_VALUE_PADDING + GRID_ICON_COMMON_SIZE + FIELD_HEAD_ICON_GAP_SIZE;
    let availableTextWidth = width - (2 * GRID_CELL_VALUE_PADDING + GRID_ICON_COMMON_SIZE + FIELD_HEAD_ICON_GAP_SIZE);
    // 在 "默认列标题高度" 模式下，换行符将转换为空格以便完整显示.
    const fieldName = _fieldName.replace(/\r|\n/g, ' ');

    const getTextData = () => {
        textSizer.setFont({ fontSize: 13 });
        const { width, height, isOverflow } = textSizer.measureText(fieldName, availableTextWidth, 1);
        return {
            width: Math.min(width, availableTextWidth),
            height,
            isOverflow
        };
    };

    const commonIconOffsetY = (headHeight - GRID_ICON_COMMON_SIZE) / 2;

    const group = new Konva.Group({ x: x, y: y });
    const rect = new Konva.Rect({
        x: 0.5,
        y: 0.5,
        name: generateTargetName({
            targetName: GRID_FIELD_HEAD,
            fieldId
        }),
        width: width,
        height: headHeight,
        fill: colors.defaultBg,
        stroke: stroke || colors.sheetLineColor,
        strokeWidth: 1
    });

    const fieldIcon = FieldIcon({
        fieldType: field.type,
        x: GRID_CELL_VALUE_PADDING,
        y: (headHeight - GRID_ICON_COMMON_SIZE) / 2,
        width: GRID_ICON_COMMON_SIZE,
        height: GRID_ICON_COMMON_SIZE,
        fill: colors.secondLevelText
    });

    const textData = getTextData();
    const text = Text({
        x: textOffset,
        y: undefined,
        width: Math.max(textData.width, FIELD_HEAD_TEXT_MIN_WIDTH),
        height: headHeight + 2,
        text: fieldName,
        wrap: 'none',
        fontStyle: 'normal',
        lineHeight: 1.84,
        verticalAlign: 'middle',
        fill: colors.firstLevelText
    });

    group.add(rect);
    group.add(fieldIcon);
    group.add(text);

    return group;
};
