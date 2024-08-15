import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { GridLayout } from './layout';

interface AITableCell {
    row: any;
    isHoverColumn: boolean;
    width: number;
    isHoverRow: boolean;
    rowCreatable: boolean;
}

export class AddRowLayout extends GridLayout {
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

    private renderCell({ width }: Pick<AITableCell, 'width'>) {
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        this.rect({
            x,
            y: y + 0.5,
            width,
            height: rowHeight,
            fill: this.colors.defaultBg
        });
        this.line({
            x,
            y: y + rowHeight,
            points: [0, 0, width, 0],
            stroke: this.colors.sheetLineColor
        });
    }

    private renderFirstCell({ row }: Pick<AITableCell, 'row'>) {
        if (!this.isFirst) return;
        const { depth } = row;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        if (depth) this.renderIndentFront(depth - 1);
        const frozenOffset = !depth ? 0.5 : (depth - 1) * GRID_GROUP_OFFSET + 0.5;
        this.rect({
            x: frozenOffset,
            y: y + 0.5,
            width: columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1,
            height: rowHeight,
            fill: this.colors.defaultBg
        });
        this.line({
            x: frozenOffset,
            y,
            points: [0, 0, 0, rowHeight, columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1, rowHeight],
            stroke: this.colors.sheetLineColor
        });
    }

    private renderLastCell({ row }: Pick<AITableCell, 'row'>) {
        if (!this.isLast) return;
        const { depth } = row;
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const width = !this.isFirst && depth === 3 ? columnWidth - GRID_GROUP_OFFSET : columnWidth;
        if (!this.isFirst) {
            this.renderCell({
                width
            });
        }
        // if (depth >= 1) {
        //     this.line({
        //         x: x + width,
        //         y,
        //         points: [0, 0, 0, rowHeight],
        //         stroke: this.colors.sheetLineColor
        //     });
        // }
        this.renderAddFieldBlank(row);
    }

    render(row: Pick<AITableCell, 'row'>) {
        this.renderFirstCell({
            row
        });
        this.renderLastCell({
            row
        });
    }
}

export const addRowLayout = new AddRowLayout();
