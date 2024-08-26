import { Colors } from '@ai-table/grid';
import Konva from 'konva';
import { GRID_CELL } from '../../../constants';
import { AITableCellScrollContainerOptions } from '../../../types/cell';
import { generateTargetName } from '../../../utils';

const SCROLL_BAR_PADDING = 3;

export const CellScrollContainer = (options: AITableCellScrollContainerOptions) => {
    const { context, x, y, columnWidth, rowHeight, fieldId, recordId, renderData, children, ...rest } = options;
    const { cellScrollState } = context;
    const { renderContent, isOverflow = false, height: totalHeight = 1 } = renderData;
    const name = generateTargetName({
        targetName: GRID_CELL,
        fieldId,
        recordId
    });
    const { scrollTop } = cellScrollState;
    const height = (() => {
        if (renderContent == null) return rowHeight;
        return Math.max(Math.min(totalHeight, 130), rowHeight);
    })();
    const ratio = (height - 2 * SCROLL_BAR_PADDING) / totalHeight;
    const realScrollTop = Math.min(scrollTop, totalHeight - height);
    const group = new Konva.Group({
        x,
        y,
        clipX: 0,
        clipY: 0,
        clipWidth: columnWidth,
        clipHeight: height
    });
    if (isOverflow) {
        const rect = new Konva.Rect({
            name,
            x: columnWidth - 7,
            y: ratio * realScrollTop + SCROLL_BAR_PADDING,
            width: 5,
            height: ratio * height,
            cornerRadius: 8,
            fill: Colors.defaultCellFill,
            listening: false
        });
        group.add(rect);
    }
    const group1 = new Konva.Group({
        offsetX: isOverflow ? realScrollTop : 0,
        ...rest
    });
    group1.add(children);
    group.add(group1);
    return group;
};
