import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { GridLayout } from './layout';

interface AITableFirstCell {
    row: any;
    colors: any;
}

export class RecordRowLayout extends GridLayout {
    private renderFirstCell({ row, colors }: AITableFirstCell) {
        if (!this.isFirst) return;

        const depth = row?.depth ?? 0;
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
            fill: 'transparent'
        });
        this.setStyle({ fontSize: 13 });
        this.text({
            x: groupOffset + GRID_ROW_HEAD_WIDTH / 2,
            y: y + 10,
            text: row?.text ?? '',
            textAlign: 'center'
        });
    }

    private renderLastCell({ row, colors }: Pick<AITableFirstCell, 'row' | 'colors'>) {
        if (!this.isLast) return;
        if (this.isFirst) return;

        const { depth } = row;
        const columnWidth = this.columnWidth;
        const width = depth === 3 ? columnWidth - GRID_GROUP_OFFSET : columnWidth;
        this.rect({
            x: this.x,
            y: this.y,
            width,
            height: this.rowHeight,
            fill: colors.defaultBg,
            stroke: colors.sheetLineColor
        });
        if (depth > 1) {
            this.renderIndentEnd(depth - 1);
        }
    }

    private renderCommonCell({ colors }: Pick<AITableFirstCell, 'colors'>) {
        if (this.isFirst || this.isLast) return;

        this.rect({
            x: this.x,
            y: this.y,
            width: this.columnWidth,
            height: this.rowHeight,
            fill: colors.defaultBg,
            stroke: colors.sheetLineColor
        });
    }

    render(config: AITableFirstCell) {
        const { row, colors } = config;

        this.renderFirstCell({ row, colors });
        this.renderCommonCell({ colors });
        this.renderLastCell({ row, colors });
    }
}

export const recordRowLayout = new RecordRowLayout();
