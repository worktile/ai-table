import Konva from 'konva';
import { GRID_CELL } from '../../constants';
import { AIGrid } from '../../interface/table';
import { AITableGridContext } from '../../interface/view';
import { generateTargetName } from '../../utils/helper';

interface AITableCellScrollContainer {
    context: AITableGridContext;
    x: number;
    y: number;
    columnWidth: number;
    rowHeight: number;
    fieldId: string;
    recordId: string;
    renderData: any;
    [key: string]: any;
}

const SCROLL_BAR_PADDING = 3;

export const CellScrollContainer = (props: AITableCellScrollContainer, children: any) => {
    const { context, x, y, columnWidth, rowHeight, fieldId, recordId, renderData, ...rest } = props;
    const { aiTable, activeCellBound, cellScrollState, setActiveCellBound, setCellScrollState } = context;
    const { renderContent, isOverflow = false, height: totalHeight = 1 } = renderData;
    const colors = AIGrid.getThemeColors(aiTable);
    const name = generateTargetName({
        targetName: GRID_CELL,
        fieldId,
        recordId
    });
    const { scrollTop } = cellScrollState;

    let height: number;
    if (renderContent == null) {
        height = rowHeight;
    } else {
        height = Math.max(Math.min(totalHeight, 130), rowHeight);
    }

    const ratio = (height - 2 * SCROLL_BAR_PADDING) / totalHeight;
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
            y: ratio * realScrollTop + SCROLL_BAR_PADDING,
            height: ratio * height,
            width: 5,
            cornerRadius: 8,
            fill: colors.black300,
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

    // 设置激活单元格的宽度和高度
    if (fieldId || recordId || height || totalHeight || isOverflow) {
        setActiveCellBound({
            height
        });
        setCellScrollState({
            scrollTop: 0,
            isOverflow,
            totalHeight
        });
    }

    return container;
};
