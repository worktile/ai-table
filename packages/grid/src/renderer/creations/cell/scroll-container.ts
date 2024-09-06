import Konva from 'konva';
import { AI_TABLE_CELL, AI_TABLE_SCROLL_BAR_PADDING } from '../../../constants';
import { AITable } from '../../../core';
import { AITableCellScrollContainerOptions } from '../../../types';
import { generateTargetName } from '../../../utils';

export const createCellScrollContainer = (options: AITableCellScrollContainerOptions) => {
    const { aiTable, context, x, y, columnWidth, rowHeight, fieldId, recordId, renderData, children, ...rest } = options;
    const { cellScrollState } = context;
    const { renderContent, isOverflow = false, height: totalHeight = 1 } = renderData;
    const colors = AITable.getColors();
    const name = generateTargetName({
        targetName: AI_TABLE_CELL,
        fieldId,
        recordId
    });
    const { scrollTop } = cellScrollState();

    let height: number;
    if (renderContent == null) {
        height = rowHeight;
    } else {
        height = Math.max(Math.min(totalHeight, 130), rowHeight);
    }

    const ratio = (height - 2 * AI_TABLE_SCROLL_BAR_PADDING) / totalHeight;
    const realScrollTop = Math.min(scrollTop!, totalHeight - height);
    const clipProps = {
        clipX: 0,
        clipY: 0,
        clipWidth: columnWidth,
        clipHeight: height
    };
    const container = new Konva.Group({
        x,
        y,
        ...clipProps
    });

    if (isOverflow) {
        const rect = new Konva.Rect({
            name,
            x: columnWidth - 7,
            y: ratio * realScrollTop + AI_TABLE_SCROLL_BAR_PADDING,
            height: ratio * height,
            width: 5,
            cornerRadius: 8,
            fill: colors.white,
            listening: false
        });
        container.add(rect);
    }
    const content = new Konva.Group({
        offsetY: isOverflow ? realScrollTop : 0,
        ...rest
    });
    content.add(...children);
    container.add(content);

    return container;
};
