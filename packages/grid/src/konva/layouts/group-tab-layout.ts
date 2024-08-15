import { AITableField } from '@ai-table/grid';
import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH, RowHeightLevel } from '../constants/grid';
import { AITableRenderStyle } from '../interface/grid';
import { cellHelper } from './cell-helper';
import { GridLayout } from './layout';

interface AITableCell {
    row: any;
    cellValue: any;
    groupField: AITableField;
}

export class GroupTabLayout extends GridLayout {
    protected override renderAddFieldBlank(row: any) {
        super.renderAddFieldBlank(row);
        const { depth } = row;
        if (depth === 0) {
            const width = this.addBtnWidth;
            this.line({
                x: this.x + this.columnWidth,
                y: this.y,
                points: [0, 0, width, 0],
                stroke: this.colors.sheetLineColor
            });
        }
    }

    private renderFirstCell({ row, cellValue, groupField }: AITableCell) {
        if (!this.isFirst) return;
        const { recordId, depth } = row;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        if (depth) this.renderIndentFront(depth);
        const groupOffset = depth * GRID_GROUP_OFFSET + 0.5;
        const fill = this.getGroupBackgroundByDepth(depth);
        this.rect({
            x: groupOffset,
            y,
            width: columnWidth - groupOffset + GRID_ROW_HEAD_WIDTH + 0.5,
            height: rowHeight,
            fill,
            stroke: this.colors.sheetLineColor
        });

        // Compatible with grouping condition column with incorrect data
        if (groupField == null) {
            this.setStyle({ fontSize: 14 });
            return this.text({
                x: groupOffset + 35,
                y: y + (rowHeight - 14) / 2,
                text: '',
                fillStyle: this.colors.thirdLevelText,
                fontSize: 14
            });
        }

        this.setStyle({ fontSize: 12 });
        this.text({
            x: groupOffset + 35,
            y: y + 6,
            text: groupField.name,
            fillStyle: this.colors.thirdLevelText,
            fontSize: 12
        });
        if (cellValue != null) {
            this.setStyle({ fontSize: 13 });
            this.ctx.save();
            this.ctx.rect(groupOffset + 25.5, y + 17.5, columnWidth, rowHeight - 18);
            this.ctx.clip();
            this.ctx.restore();
            const renderProps = {
                x: groupOffset + 25.5,
                y: y + 17.5,
                columnWidth,
                rowHeight: rowHeight - 18,
                recordId,
                field: groupField,
                cellValue,
                isActive: false,
                style: { textAlign: 'left' } as AITableRenderStyle,
                rowHeightLevel: RowHeightLevel.short
            };
            return cellHelper.renderCellValue(renderProps, this.ctx);
        }
        this.setStyle({ fontSize: 14 });
        this.text({
            x: groupOffset + 36,
            y: y + 24,
            text: `(${cellValue == null ? '' : cellValue[groupField._id].text})`,
            fillStyle: this.colors.thirdLevelText,
            fontSize: 14
        });
    }

    private renderLastCell(row: any) {
        if (!this.isLast) return;
        this.renderAddFieldBlank(row);
        if (this.isFirst) return;

        const { depth } = row;
        if (depth) this.renderIndentEnd(depth);

        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const lastTabOffsetList = [40, 0, -GRID_GROUP_OFFSET];
        const width = columnWidth + lastTabOffsetList[depth];
        const fill = this.getGroupBackgroundByDepth(depth);
        this.rect({
            x,
            y: y + 0.5,
            width,
            height: rowHeight,
            fill
        });
        this.line({
            x,
            y,
            points: [0, 0, width, 0, width, rowHeight, 0, rowHeight],
            stroke: this.colors.sheetLineColor
        });
    }

    private renderCommonCell(row: any) {
        if (this.isFirst || this.isLast) return;
        const x = this.x;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const { depth } = row;
        const fill = this.getGroupBackgroundByDepth(depth);
        this.rect({
            x,
            y,
            width: columnWidth,
            height: rowHeight,
            fill
        });
        this.line({
            x,
            y,
            points: [0, 0, columnWidth, 0],
            stroke: this.colors.sheetLineColor
        });
        this.line({
            x,
            y,
            points: [0, rowHeight, columnWidth, rowHeight],
            stroke: this.colors.sheetLineColor
        });
    }

    render({ row, cellValue, groupField }: AITableCell) {
        this.renderFirstCell({
            row,
            cellValue,
            groupField
        });
        this.renderLastCell(row);
        this.renderCommonCell(row);
    }
}

export const groupTabLayout = new GroupTabLayout();
