import {
    AI_TABLE_CELL,
    AI_TABLE_CELL_PADDING,
    DEFAULT_FONT_STYLE,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_LINE_HEIGHT,
    DEFAULT_TEXT_VERTICAL_ALIGN_TOP
} from '../../../constants';
import { AITable } from '../../../core';
import { AITableCellOptions } from '../../../types';
import { generateTargetName } from '../../../utils';
import { createText } from '../create-text';
import { createCellScrollContainer } from './scroll-container';

export const createCellText = (options: AITableCellOptions) => {
    const { aiTable, context, x, y, recordId, field, rowHeight, columnWidth, isActive, renderData } = options;
    const colors = AITable.getColors();
    const { _id: fieldId } = field;
    const name = generateTargetName({
        targetName: AI_TABLE_CELL,
        fieldId,
        recordId,
        mouseStyle: 'pointer'
    });
    const { renderContent } = renderData;

    let children = [];
    const renderText = () => {
        const { width, height, text: entityText, textData, style } = renderContent;
        const commonOptions = {
            name,
            lineHeight: DEFAULT_TEXT_LINE_HEIGHT,
            verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_TOP,
            align: style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT,
            fontStyle: style?.fontWeight || DEFAULT_FONT_STYLE,
            ellipsis: false
        };

        if (!textData) {
            const text = createText({
                x: AI_TABLE_CELL_PADDING,
                y: 4.5,
                width,
                heigh: height,
                text: entityText,
                wrap: 'word',
                listening: true,
                ...commonOptions
            });
            return [text];
        } else {
            const texts = textData.map((item: any) => {
                const { offsetX, offsetY, text } = item;
                const listening = false;
                const textNode = createText({
                    x: offsetX + AI_TABLE_CELL_PADDING,
                    y: offsetY + 4.5,
                    heigh: 24,
                    text,
                    listening,
                    textDecoration: listening ? 'underline' : '',
                    fill: listening ? colors.primary : colors.gray800,
                    ...commonOptions
                });
                return textNode;
            });
            return texts;
        }
    };

    if (isActive) {
        children.push(...renderText());
    }
    const element = createCellScrollContainer({
        aiTable,
        context,
        x,
        y,
        columnWidth,
        rowHeight,
        fieldId,
        recordId,
        renderData,
        children
    });
    return element;
};
