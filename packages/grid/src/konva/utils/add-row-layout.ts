import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_GROUP_OFFSET, GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AddOutlinedPath } from '../constants/icon';
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
        const width = GRID_ADD_FIELD_BUTTON_WIDTH;
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
        const rowCreatable = true;
        if (rowCreatable) {
            const curX = depth ? (depth - 1) * GRID_GROUP_OFFSET + 30 : 30;
            this.path({
                x: curX,
                y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
                data: AddOutlinedPath,
                size: 16,
                fill: this.colors.thirdLevelText
            });
            // this.text({
            //     x: 10,
            //     y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
            //     text: 'icon',
            //     fillStyle: 'red'
            // });
            // hover 的时候 添加一行 text提示 新增一行
            // if (isHoverColumn && isHoverRow) {
            //   this.setStyle({
            //     fontSize: 13,
            //     fontWeight: 'normal',
            //   });
            //   this.text({
            //     x: curX + 18,
            //     y: y + rowHeight / 2,
            //     verticalAlign: 'middle',
            //     text: t(Strings.add_row_button_tip),
            //     fillStyle: colors.black[500],
            //   });
            // }
        }
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

    private renderCommonCell() {
        if (this.isFirst || this.isLast) return;
        this.renderCell({
            width: this.columnWidth
        });
    }

    render(row: Pick<AITableCell, 'row'>) {
        this.renderFirstCell(row);
        this.renderCommonCell();
        this.renderLastCell(row);
    }
}

export const addRowLayout = new AddRowLayout();
