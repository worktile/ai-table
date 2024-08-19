import { GRID_GROUP_OFFSET, GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AddOutlinedPath } from '../constants/icon';
import { AILinearRow } from '../interface/grid';
import { GridLayout } from './layout';

interface AITableCell {
    row: any;
    isHoverColumn: boolean;
    width: number;
    isHoverRow: boolean;
    rowCreatable: boolean;
}

export class AddRowLayout extends GridLayout {
    override renderAddFieldBlank(row: AILinearRow) {
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

    private renderCell({ width, isHoverRow, rowCreatable }: Pick<AITableCell, 'width' | 'isHoverRow' | 'rowCreatable'>) {
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const fill = isHoverRow && rowCreatable ? this.colors.bgBglessHoverSolid : this.colors.defaultBg;
        this.rect({
            x,
            y: y + 0.5,
            width,
            height: rowHeight,
            fill: fill
        });
        this.line({
            x,
            y: y + rowHeight,
            points: [0, 0, width, 0],
            stroke: this.colors.sheetLineColor
        });
    }

    private renderFirstCell({
        row,
        isHoverRow,
        isHoverColumn,
        rowCreatable
    }: Pick<AITableCell, 'row' | 'isHoverRow' | 'isHoverColumn' | 'rowCreatable'>) {
        if (!this.isFirst) return;
        const { depth } = row;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        if (depth) this.renderIndentFront(depth - 1);
        const frozenOffset = !depth ? 0.5 : (depth - 1) * GRID_GROUP_OFFSET + 0.5;
        const fill = isHoverRow && rowCreatable ? this.colors.bgBglessHoverSolid : this.colors.defaultBg;
        this.rect({
            x: frozenOffset,
            y: y + 0.5,
            width: columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1,
            height: rowHeight,
            fill
        });
        this.line({
            x: frozenOffset,
            y,
            points: [0, 0, 0, rowHeight, columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1, rowHeight],
            stroke: this.colors.sheetLineColor
        });
        if (rowCreatable) {
            const curX = depth ? (depth - 1) * GRID_GROUP_OFFSET + 30 : 30;
            this.path({
                x: curX,
                y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
                data: AddOutlinedPath,
                size: 16,
                fill: this.colors.thirdLevelText
            });
            if (isHoverColumn && isHoverRow) {
                this.setStyle({
                    fontSize: 13,
                    fontWeight: 'normal'
                });
                this.text({
                    x: curX + 18,
                    y: y + rowHeight / 2,
                    verticalAlign: 'middle',
                    text: '新增一行',
                    fillStyle: this.colors.black500
                });
            }
        }
    }

    private renderLastCell({ row, rowCreatable, isHoverRow }: Pick<AITableCell, 'row' | 'rowCreatable' | 'isHoverRow'>) {
        if (!this.isLast) return;
        const { depth } = row;
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const width = !this.isFirst && depth === 3 ? columnWidth - GRID_GROUP_OFFSET : columnWidth;
        if (!this.isFirst) {
            this.renderCell({
                width,
                rowCreatable,
                isHoverRow
            });
            if (depth === 3) {
                this.renderIndentEnd(depth);
            }
        }
        if (depth === 1) {
            this.line({
                x: x + width,
                y,
                points: [0, 0, 0, rowHeight],
                stroke: this.colors.sheetLineColor
            });
        }
        this.renderAddFieldBlank(row);
    }

    private renderCommonCell({ rowCreatable, isHoverRow }: Pick<AITableCell, 'rowCreatable' | 'isHoverRow'>) {
        if (this.isFirst || this.isLast) return;
        this.renderCell({
            width: this.columnWidth,
            rowCreatable,
            isHoverRow
        });
    }

    render({ row, isHoverRow, isHoverColumn, rowCreatable }: Pick<AITableCell, 'row' | 'isHoverRow' | 'isHoverColumn' | 'rowCreatable'>) {
        this.renderFirstCell({
            row,
            isHoverRow,
            isHoverColumn,
            rowCreatable
        });
        this.renderCommonCell({
            isHoverRow,
            rowCreatable
        });
        this.renderLastCell({
            row,
            isHoverRow,
            rowCreatable
        });
    }
}

export const addRowLayout = new AddRowLayout();
