import { range } from 'rxjs';
import { GRID_GROUP_OFFSET } from '../constants/grid';
import { KonvaDrawer } from './drawer';

interface AITableLayout {
    x: number;
    y: number;
    rowIndex: number;
    columnIndex: number;
    rowHeight: number;
    columnWidth: number;
    columnCount: number;
}

export class GridLayout extends KonvaDrawer {
    protected x = 0;
    protected y = 0;
    protected rowHeight = 0;
    protected columnWidth = 0;
    protected rowIndex = 0;
    protected columnIndex = 0;
    protected columnCount = 0;

    init({ x, y, rowIndex, columnIndex, rowHeight, columnWidth, columnCount }: AITableLayout) {
        this.x = x;
        this.y = y;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.rowHeight = rowHeight;
        this.columnWidth = columnWidth;
        this.columnCount = columnCount;
    }

    protected get isFirst() {
        return this.columnIndex === 0;
    }

    protected get isLast() {
        return this.columnIndex === this.columnCount - 1;
    }

    /**
     * 渲染行标题缩进区域
     */
    protected renderIndentFront(depth: number) {
        range(depth).forEach((i) => {
            this.rect({
                x: i * GRID_GROUP_OFFSET,
                y: this.y - 0.5,
                width: GRID_GROUP_OFFSET,
                height: this.rowHeight,
                fill: this.colors.defaultBg
            });
            this.line({
                x: i * GRID_GROUP_OFFSET + 0.5,
                y: this.y,
                points: [0, 0, 0, this.rowHeight],
                stroke: this.colors.sheetLineColor
            });
        });
    }

    /**
     * 渲染行尾缩进区域
     */
    protected renderIndentEnd(depth: number) {
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const tabSizeList = [40, GRID_GROUP_OFFSET, 0];
        range(depth).forEach((i) => {
            const isFirstGroup = i === 0;
            const rectOffsetX = isFirstGroup ? 0 : -GRID_GROUP_OFFSET;
            const lineOffsetX = isFirstGroup ? 40 : 0;
            this.rect({
                x: x + columnWidth + rectOffsetX + 0.5,
                y: y - 0.5,
                width: tabSizeList[i],
                height: rowHeight,
                fill: this.colors.defaultBg
            });
            this.line({
                x: x + columnWidth + lineOffsetX,
                y,
                points: [0, 0, 0, rowHeight],
                stroke: this.colors.sheetLineColor
            });
        });
    }
}
