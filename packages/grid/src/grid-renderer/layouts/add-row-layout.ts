import { Layout } from './layout';
import {
    AddOutlinedPath,
    AI_TABLE_ADD_FIELD_BUTTON_WIDTH,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_HEAD_WIDTH
} from '../../constants';
import { AITableCell } from '../../types';

export class AddRowLayout extends Layout {
    override renderAddFieldBlank() {
        super.renderAddFieldBlank();
        const rowHeight = this.rowHeight;
        const defaultWidth = AI_TABLE_ADD_FIELD_BUTTON_WIDTH;
        const width = this.containerWidth - this.x < defaultWidth ? defaultWidth : this.containerWidth - this.x;
        this.line({
            x: this.x + this.columnWidth,
            y: this.y,
            points: [0, rowHeight, width, rowHeight],
            stroke: this.colors.gray200
        });
    }

    private renderCell({ width, isHoverRow }: Pick<AITableCell, 'width' | 'isHoverRow'>) {
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const fill = isHoverRow ? this.colors.gray80 : this.colors.transparent;
        this.rect({
            x,
            y: y + 0.5,
            width: width as number,
            height: rowHeight,
            fill
        });
        this.line({
            x,
            y: y + rowHeight,
            points: [0, 0, width as number, 0],
            stroke: this.colors.gray200
        });
    }

    private renderFirstCell({ isHoverRow }: Pick<AITableCell, 'isHoverRow'>) {
        if (!this.isFirst) return;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const frozenOffset = AI_TABLE_OFFSET;
        const fill = isHoverRow ? this.colors.gray80 : this.colors.transparent;
        this.rect({
            x: frozenOffset,
            y: y + 0.5,
            width: columnWidth + AI_TABLE_ROW_HEAD_WIDTH - frozenOffset + 1,
            height: rowHeight,
            fill
        });
        this.line({
            x: frozenOffset,
            y,
            points: [0, rowHeight, columnWidth + AI_TABLE_ROW_HEAD_WIDTH - frozenOffset + 1, rowHeight],
            stroke: this.colors.gray200
        });

        this.path({
            x: AI_TABLE_CELL_PADDING,
            y: y + (rowHeight - AI_TABLE_ICON_COMMON_SIZE) / 2 - 0.5,
            data: AddOutlinedPath,
            size: 16,
            fill: this.colors.gray600
        });
        if (isHoverRow) {
            this.setStyle({
                fontSize: 13,
                fontWeight: 'normal'
            });
            this.text({
                x: AI_TABLE_CELL_PADDING + 18,
                y: y + rowHeight / 2,
                verticalAlign: 'middle',
                text: '新增一行',
                fillStyle: this.colors.gray800
            });
        }
    }

    private renderLastCell({ isHoverRow }: Pick<AITableCell, 'isHoverRow'>) {
        if (!this.isLast) return;
        const width = this.columnWidth;
        if (!this.isFirst) {
            this.renderCell({
                width,
                isHoverRow
            });
        }
        this.renderAddFieldBlank();
    }

    private renderCommonCell({ isHoverRow }: Pick<AITableCell, 'isHoverRow'>) {
        if (this.isFirst || this.isLast) return;
        this.renderCell({
            width: this.columnWidth,
            isHoverRow
        });
    }

    render({ isHoverRow }: Pick<AITableCell, 'isHoverRow'>) {
        this.renderFirstCell({
            isHoverRow
        });
        this.renderCommonCell({
            isHoverRow
        });
        this.renderLastCell({
            isHoverRow
        });
    }
}

export const addRowLayout = new AddRowLayout();
