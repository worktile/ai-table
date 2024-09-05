import Konva from 'konva';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    DEFAULT_FONT_SIZE,
    MoreStandOutlinedPath
} from '../constants';
import { AITable } from '../core';
import { AITableFieldHeadOptions } from '../types';
import { generateTargetName, TextMeasure } from '../utils';
import { createFieldIcon } from './field-icon';
import { createText } from './text';
import { createIcon } from './icon';

export const createFieldHead = (options: AITableFieldHeadOptions) => {
    const colors = AITable.getColors();
    const textMeasure = TextMeasure();
    const { x = 0, y = 0, width, field, height: headHeight, stroke, iconVisible } = options;
    const { _id: fieldId, name: _fieldName } = field;
    const textOffset = AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;

    let availableTextWidth =
        width -
        (iconVisible
            ? 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE)
            : 2 * AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE);
    // 在 "默认列标题高度" 模式下，换行符将转换为空格以便完整显示.
    const fieldName = _fieldName.replace(/\r|\n/g, ' ');

    const getTextData = () => {
        textMeasure.setFont({ fontSize: DEFAULT_FONT_SIZE });
        const { width, height, isOverflow } = textMeasure.measureText(fieldName, availableTextWidth, 1);
        return {
            width: Math.min(width, availableTextWidth),
            height,
            isOverflow
        };
    };

    const group = new Konva.Group({ x: x, y: y });
    const rect = new Konva.Rect({
        x: AI_TABLE_OFFSET,
        y: AI_TABLE_OFFSET,
        name: generateTargetName({
            targetName: AI_TABLE_FIELD_HEAD,
            fieldId
        }),
        width: width,
        height: headHeight,
        fill: colors.white,
        stroke: stroke || colors.gray200,
        strokeWidth: 1,
        onMouseEnter: () => {},
        onMouseOut: () => {}
    });

    const fieldIcon = createFieldIcon({
        field: field,
        x: AI_TABLE_CELL_PADDING,
        y: (headHeight - AI_TABLE_ICON_COMMON_SIZE) / 2,
        width: AI_TABLE_ICON_COMMON_SIZE,
        height: AI_TABLE_ICON_COMMON_SIZE,
        fill: colors.gray600
    });

    const textData = getTextData();
    const text = createText({
        x: textOffset,
        y: undefined,
        width: Math.max(textData.width, AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH),
        height: headHeight + 2,
        text: fieldName,
        lineHeight: 1.84
    });

    const commonIconOffsetY = (headHeight - AI_TABLE_ICON_COMMON_SIZE) / 2;

    group.add(rect);
    group.add(fieldIcon);
    group.add(text);

    if (iconVisible) {
        const moreIcon = createIcon({
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_HEAD_MORE,
                fieldId
            }),
            x: width - AI_TABLE_CELL_PADDING - AI_TABLE_ICON_COMMON_SIZE,
            y: commonIconOffsetY,
            data: MoreStandOutlinedPath,
            fill: colors.gray600,
            background: colors.white
        });
        group.add(moreIcon);
    }

    return group;
};
