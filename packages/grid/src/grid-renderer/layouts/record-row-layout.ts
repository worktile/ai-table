import { AI_TABLE_ROW_HEAD_WIDTH, DEFAULT_FONT_SIZE } from '../../constants';
import { AITable } from '../../core';
import { AITableFirstCell } from '../../types';
import { Layout } from './layout';

/**
 * 绘制行的布局，通过直接操作 Canvas 提供高效的渲染方法。
 * 它继承自 Layout 类，包含了用于绘制行中单元格（尤其是首列和尾列）的几个方法
 */
export class RecordRowLayout extends Layout {
    // 首列
    private renderFirstCell({ row, style }: AITableFirstCell) {
        if (!this.isFirst) return;

        const { fill } = style;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const colors = AITable.getColors();

        // 背景、边框
        this.customRect({
            x: 0.5,
            y,
            width: AI_TABLE_ROW_HEAD_WIDTH + columnWidth + 0.5,
            height: rowHeight,
            fill: fill,
            strokes: {
                top: colors.gray200,
                right: colors.gray200,
                bottom: colors.gray200
            }
        });
        this.customRect({
            x: 0.5,
            y,
            width: AI_TABLE_ROW_HEAD_WIDTH - 0.5,
            height: rowHeight,
            fill: fill,
            strokes: {
                right: colors.gray200
            }
        });
        // 设置字体样式，居中绘制行号
        this.setStyle({ fontSize: DEFAULT_FONT_SIZE });
        this.text({
            x: AI_TABLE_ROW_HEAD_WIDTH / 2,
            y: y + 10,
            text: String(row.displayIndex),
            textAlign: 'center'
        });
    }

    // 尾列
    private renderLastCell({ style }: Pick<AITableFirstCell, 'style'>) {
        if (!this.isLast || this.isFirst) return;

        const { fill, stroke } = style;
        const columnWidth = this.columnWidth;
        const width = columnWidth;
        const colors = AITable.getColors();

        // 背景、边框
        this.rect({
            x: this.x,
            y: this.y,
            width,
            height: this.rowHeight,
            fill: fill || colors.white,
            stroke: stroke || colors.gray200
        });
    }

    // 绘制中间的普通单元格
    private renderCommonCell({ style }: Pick<AITableFirstCell, 'style'>) {
        if (this.isFirst || this.isLast) return;

        const { fill, stroke } = style;
        const colors = AITable.getColors();

        // 背景、边框
        this.rect({
            x: this.x,
            y: this.y,
            width: this.columnWidth,
            height: this.rowHeight,
            fill: fill || colors.white,
            stroke: stroke || colors.gray200
        });
    }

    render(config: AITableFirstCell) {
        const { row, style } = config;

        this.renderFirstCell({ row, style });
        this.renderCommonCell({ style });
        this.renderLastCell({ style });
    }
}

export const recordRowLayout = new RecordRowLayout();
