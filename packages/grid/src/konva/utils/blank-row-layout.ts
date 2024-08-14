import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { GridLayout } from './layout';

export class BlankRowLayout extends GridLayout {
    override renderAddFieldBlank(row: any) {
        super.renderAddFieldBlank(row);
        const { depth } = row;
        const width = this.addBtnWidth;
        const rowHeight = this.rowHeight;
        if (depth <= 1) {
            this.line({
                x: this.x + this.columnWidth,
                y: this.y,
                points: [0, rowHeight, width, rowHeight],
                stroke: this.colors.sheetLineColor
            });
        }
    }

    private renderFirstCell(row: any, colors: { lowestBg: string; sheetLineColor: string }) {
        if (!this.isFirst) return;

        const { depth } = row;
        const x = (depth - 1) * GRID_GROUP_OFFSET + 0.5;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        if (depth === 0) {
            return this.rect({
                x: 0.5,
                y: y + 0.5,
                width: columnWidth + GRID_ROW_HEAD_WIDTH + 0.5,
                height: rowHeight,
                fill: this.colors.lowestBg
            });
        }
        this.renderIndentFront(depth);
        this.rect({
            x: x + 0.5,
            y: y + 0.5,
            width: columnWidth + GRID_ROW_HEAD_WIDTH + 0.5,
            height: rowHeight,
            fill: this.getGroupBackgroundByDepth(depth - 1)
        });
        this.line({
            x: x + 0.5,
            y,
            points: [0, rowHeight, columnWidth + GRID_ROW_HEAD_WIDTH, rowHeight],
            stroke: this.colors.sheetLineColor
        });
    }

    private renderLastCell(row: any) {
        if (!this.isLast) return;
        if (this.isFirst) {
            return this.renderAddFieldBlank(row);
        }
        const { depth } = row;
        if (depth === 0) return;

        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const width = depth === 1 ? columnWidth + 39 : columnWidth;
        this.renderIndentEnd(depth);
        this.rect({
            x: x + 0.5,
            y: y + 0.5,
            width: width + 0.5,
            height: rowHeight,
            fill: this.getGroupBackgroundByDepth(depth - 1)
        });
        this.line({
            x: x + 0.5,
            y,
            points: [0, rowHeight, width, rowHeight],
            stroke: this.colors.sheetLineColor
        });
        if (depth === 2) {
            this.line({
                x: x + columnWidth,
                y,
                points: [0, 0, 0, rowHeight],
                stroke: this.colors.sheetLineColor
            });
        }
    }

    private renderCommonCell(row: any) {
        if (this.isFirst || this.isLast) return;

        const { depth } = row;
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        this.rect({
            x: x + 0.5,
            y: y + 0.5,
            width: columnWidth + 0.5,
            height: rowHeight,
            fill: this.getGroupBackgroundByDepth(depth - 1)
        });
        this.line({
            x: x + 0.5,
            y,
            points: [0, rowHeight, columnWidth, rowHeight],
            stroke: this.colors.sheetLineColor
        });
    }

    render({ row, colors }: { row: any; colors: { lowestBg: string; sheetLineColor: string } }) {
        this.renderFirstCell(row, colors);
        this.renderCommonCell(row);
        this.renderLastCell(row);
    }
}

export const blankRowLayout = new BlankRowLayout();
