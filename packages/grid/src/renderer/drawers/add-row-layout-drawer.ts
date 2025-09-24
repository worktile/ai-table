import {
    AddOutlinedPath,
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_DRAG_ICON_WIDTH,
    AI_TABLE_ROW_HEAD_SIZE
} from '../../constants';
import { AITableCell } from '../../types';
import { Layout } from './layout-drawer';

export class AddRowLayout extends Layout {
    override renderAddFieldBlank({ isHoverRow, isCheckedRow }: Pick<AITableCell, 'isHoverRow' | 'isCheckedRow'>) {
        super.renderAddFieldBlank({ isHoverRow, isCheckedRow });
        const rowHeight = this.rowHeight;
        const defaultWidth = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
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
            y: y + AI_TABLE_OFFSET,
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

    private renderFirstCell({ isHoverRow, isDisabled }: Pick<AITableCell, 'isHoverRow' | 'isDisabled'>) {
        if (!this.isFirst) return;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const frozenOffset = AI_TABLE_OFFSET;
        const fill = isHoverRow ? this.colors.gray80 : this.colors.transparent;
        let x = 0;
        if (this.hiddenIndexColumn) {
            x = frozenOffset;
        } else {
            x = frozenOffset + (this.hiddenRowDrag ? 0 : AI_TABLE_ROW_DRAG_ICON_WIDTH);
        }

        this.rect({
            x,
            y: y + AI_TABLE_OFFSET,
            width: columnWidth + this.rowHeadWidth - frozenOffset + 1,
            height: rowHeight,
            fill
        });
        this.line({
            x,
            y,
            points: [0, rowHeight, columnWidth + this.rowHeadWidth - frozenOffset + 1, rowHeight],
            stroke: this.colors.gray200
        });

        this.path({
            x: x + AI_TABLE_CELL_PADDING,
            y: y + (rowHeight - AI_TABLE_ICON_COMMON_SIZE) / 2 - AI_TABLE_OFFSET,
            data: AddOutlinedPath,
            size: AI_TABLE_ROW_HEAD_SIZE,
            fill: this.readonly || isDisabled ? this.colors.gray300 : this.colors.gray600
        });
    }

    private renderLastCell({ isHoverRow, isCheckedRow }: Pick<AITableCell, 'isHoverRow' | 'isCheckedRow'>) {
        if (!this.isLast) return;
        const width = this.columnWidth;
        if (!this.isFirst) {
            this.renderCell({
                width,
                isHoverRow
            });
        }
        this.renderAddFieldBlank({ isHoverRow, isCheckedRow });
    }

    private renderCommonCell({ isHoverRow }: Pick<AITableCell, 'isHoverRow'>) {
        if (this.isFirst || this.isLast) return;
        this.renderCell({
            width: this.columnWidth + AI_TABLE_CELL_LINE_BORDER,
            isHoverRow
        });
    }

    render({ isHoverRow, isCheckedRow, isDisabled }: Pick<AITableCell, 'isHoverRow' | 'isCheckedRow' | 'isDisabled'>) {
        this.renderFirstCell({
            isHoverRow,
            isDisabled
        });
        this.renderCommonCell({
            isHoverRow
        });
        this.renderLastCell({
            isHoverRow,
            isCheckedRow
        });
    }
}

export const addRowLayout = new AddRowLayout();
