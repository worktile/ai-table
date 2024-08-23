import { AILinearRowRecord } from '@ai-table/grid';
import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { GridLayout } from './layout';

interface AITableFirstCell {
    row: any;
    style: any;
    isActiveRow: boolean;
    isCheckedRow: boolean;
    isHoverRow: boolean;
    colors: any;
}

/**
 * 控制行的布局，如行号、行背景色、行高等
 */
export class RecordRowLayout extends GridLayout {
    private renderFirstCell({ row, style, isActiveRow, isCheckedRow, isHoverRow, colors }: AITableFirstCell) {
        if (!this.isFirst) return;

        const { depth } = row;
        const { fill } = style;
        if (depth) this.renderIndentFront(depth - 1);
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const groupOffset = depth ? (depth - 1) * GRID_GROUP_OFFSET + 0.5 : 0.5;
        this.rect({
            x: groupOffset,
            y,
            width: GRID_ROW_HEAD_WIDTH + columnWidth - groupOffset + 0.5,
            height: rowHeight,
            fill: colors.white,
            stroke: colors.sheetLineColor
        });
        this.rect({
            x: GRID_ROW_HEAD_WIDTH + groupOffset,
            y: y + 0.5,
            width: columnWidth - groupOffset,
            height: rowHeight - 1,
            fill: fill || 'transparent'
        });
        // hover、选中、勾选时行号处理
        if (isHoverRow || isCheckedRow || isActiveRow) {
            let fill: string = colors.bgBglessHoverSolid;
            if (isCheckedRow || isActiveRow) {
                fill = colors.bgBrandLightDefaultSolid;
            }
            return this.rect({
                x: groupOffset + 0.5,
                y: y + 0.5,
                width: GRID_ROW_HEAD_WIDTH,
                height: rowHeight - 1,
                fill
            });
        }
        this.setStyle({ fontSize: 13 });
        this.text({
            x: groupOffset + GRID_ROW_HEAD_WIDTH / 2,
            y: y + 10,
            text: String((row as AILinearRowRecord).displayIndex),
            textAlign: 'center'
        });
    }

    private renderLastCell({ row, style, colors }: Pick<AITableFirstCell, 'row' | 'style' | 'colors'>) {
        if (!this.isLast) return;
        this.renderAddFieldBlank(row);
        if (this.isFirst) return;
        const { depth } = row;
        const { fill, stroke } = style;
        const columnWidth = this.columnWidth;
        const width = depth === 3 ? columnWidth - GRID_GROUP_OFFSET : columnWidth;
        this.rect({
            x: this.x,
            y: this.y,
            width,
            height: this.rowHeight,
            fill: fill || colors.defaultBg,
            stroke: stroke || colors.sheetLineColor
        });
        if (depth > 1) {
            this.renderIndentEnd(depth - 1);
        }
    }

    private renderCommonCell({ style, colors }: Pick<AITableFirstCell, 'colors' | 'style'>) {
        if (this.isFirst || this.isLast) return;

        const { fill, stroke } = style;
        this.rect({
            x: this.x,
            y: this.y,
            width: this.columnWidth,
            height: this.rowHeight,
            fill: fill || colors.defaultBg,
            stroke: stroke || colors.sheetLineColor
        });
    }

    render(config: AITableFirstCell) {
        const { row, style, isHoverRow, isCheckedRow, isActiveRow, colors } = config;

        this.renderFirstCell({ row, style, isHoverRow, isActiveRow, isCheckedRow, colors });
        this.renderCommonCell({ style, colors });
        this.renderLastCell({ row, style, colors });
    }
}

export const recordRowLayout = new RecordRowLayout();
