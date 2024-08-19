import { AITableField } from '@ai-table/grid';
import Konva from 'konva';
import { Text } from '../components/text';
import { GRID_FIELD_HEAD } from '../constants/config';
import { DefaultTheme } from '../constants/default-theme';
import {
    FIELD_HEAD_ICON_GAP_SIZE,
    FIELD_HEAD_TEXT_MIN_WIDTH,
    GRID_CELL_VALUE_PADDING,
    GRID_FIELD_HEAD_HEIGHT,
    GRID_ICON_COMMON_SIZE,
    GRID_ICON_SMALL_SIZE
} from '../constants/grid';
import { autoSizerCanvas } from '../utils/auto-size-canvas';
import { generateTargetName } from '../utils/helper';
import { FieldIcon } from './field-icon';

interface AITableFieldHeadConfig {
    x?: number;
    y?: number;
    width: number;
    height: number;
    field: AITableField;
    columnIndex: number;
    stroke?: string;
    isFrozen: boolean;
    iconVisible: boolean; // Show icon or not, show when mouse over, otherwise hide
    isSelected: boolean;
    isHighlight: boolean;
    editable: boolean;
    autoHeadHeight: boolean;
}

export const FieldHead = (config: AITableFieldHeadConfig) => {
    const {
        x = 0,
        y = 0,
        width,
        field,
        height: headHeight,
        stroke,
        iconVisible,
        isSelected,
        isHighlight,
        editable,
        isFrozen,
        autoHeadHeight: _autoHeadHeight
    } = config;

    const textSizer = autoSizerCanvas;
    const colors = DefaultTheme.color;
    const { _id: fieldId, name: _fieldName } = field;
    const moreVisible = editable && iconVisible;
    const textOffset = GRID_CELL_VALUE_PADDING + GRID_ICON_COMMON_SIZE + FIELD_HEAD_ICON_GAP_SIZE;
    const autoHeadHeight = _autoHeadHeight && headHeight !== GRID_FIELD_HEAD_HEIGHT;
    let availableTextWidth =
        width -
        (autoHeadHeight || moreVisible
            ? 2 * (GRID_CELL_VALUE_PADDING + GRID_ICON_COMMON_SIZE + FIELD_HEAD_ICON_GAP_SIZE)
            : 2 * GRID_CELL_VALUE_PADDING + GRID_ICON_COMMON_SIZE + FIELD_HEAD_ICON_GAP_SIZE);

    // 在 "默认列标题高度" 模式下，换行符将转换为空格以便完整显示.
    const fieldName = _autoHeadHeight ? _fieldName : _fieldName.replace(/\r|\n/g, ' ');

    const getTextData = () => {
        textSizer.setFont({ fontSize: 13 });
        if (autoHeadHeight) {
            const { height, lastLineWidth } = textSizer.measureText(fieldName, Math.max(availableTextWidth, FIELD_HEAD_TEXT_MIN_WIDTH));
            return {
                width: Math.ceil(lastLineWidth),
                height,
                isOverflow: false
            };
        }
        const { width, height, isOverflow } = textSizer.measureText(fieldName, availableTextWidth, 1);
        return {
            width: Math.min(width, availableTextWidth),
            height,
            isOverflow
        };
    };

    const commonIconOffsetY = (headHeight - GRID_ICON_COMMON_SIZE) / 2;
    const smallIconOffsetY = autoHeadHeight ? 10 : (headHeight - GRID_ICON_SMALL_SIZE) / 2;

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
        fill: isSelected ? colors.cellSelectedColorSolid : colors.defaultBg,
        stroke: stroke || colors.sheetLineColor,
        strokeWidth: 1,
        onMouseEnter: () => {},
        onMouseOut: () => {}
    });

    const fieldIcon = FieldIcon({
        fieldType: field.type,
        x: GRID_CELL_VALUE_PADDING,
        y: autoHeadHeight ? 8 : (headHeight - GRID_ICON_COMMON_SIZE) / 2,
        width: GRID_ICON_COMMON_SIZE,
        height: GRID_ICON_COMMON_SIZE,
        fill: isHighlight ? colors.primaryColor : colors.secondLevelText
    });

    const textData = getTextData();
    const text = Text({
        x: textOffset,
        y: autoHeadHeight ? 5 : undefined,
        width: Math.max(autoHeadHeight ? availableTextWidth : textData.width, FIELD_HEAD_TEXT_MIN_WIDTH),
        height: headHeight + 2,
        text: fieldName,
        wrap: autoHeadHeight ? 'char' : 'none',
        fontStyle: 'normal',
        lineHeight: 1.84,
        verticalAlign: autoHeadHeight ? 'top' : 'middle',
        fill: isHighlight ? colors.primaryColor : colors.firstLevelText,
        ellipsis: !autoHeadHeight
    });

    group.add(rect);
    group.add(fieldIcon);
    group.add(text);

    if (isHighlight) {
        const rect = new Konva.Rect({
            x: 1,
            width: width - 1,
            height: 2,
            fill: colors.primaryColor,
            listening: false
        });
        group.add(rect);
    }

    return group;
};
