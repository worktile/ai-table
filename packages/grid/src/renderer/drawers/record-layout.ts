import {
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_DRAG_ICON_WIDTH,
    AI_TABLE_ROW_HEAD_EXPAND_WIDTH,
    DEFAULT_FONT_SIZE
} from '../../constants';
import { DEFAULT_TEXT_ALIGN_CENTER, DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE } from '../../constants/text';
import { AITable } from '../../core';
import { AITableCell, AITableLinearRowRecord } from '../../types';
import { Layout } from './layout-drawer';

/**
 * 绘制行的布局，通过直接操作 Canvas 提供高效的渲染方法。
 * 它继承自 Layout 类，包含了用于绘制行中单元格（尤其是首列和尾列）的几个方法
 */
export class RecordLayout extends Layout {
    protected override renderAddFieldBlank({ isHoverRow, isCheckedRow }: Pick<AITableCell, 'isHoverRow' | 'isCheckedRow'>): void {
        super.renderAddFieldBlank({ isHoverRow, isCheckedRow });
        const rowHeight = this.rowHeight;
        const startX = this.x + this.columnWidth;
        const lineWidth =
            this.containerWidth - startX < AI_TABLE_FIELD_ADD_BUTTON_WIDTH ? AI_TABLE_FIELD_ADD_BUTTON_WIDTH : this.containerWidth - startX;
        this.line({
            x: startX,
            y: this.y,
            points: [0, rowHeight, lineWidth, rowHeight],
            stroke: this.colors.gray200
        });
    }

    // 首列
    private renderFirstCell({ row, style, indexStyle, isHoverRow, isCheckedRow }: AITableCell) {
        if (!this.isFirst) return;
        const { fill } = style || {};
        const { fill: indexFill } = indexStyle || {};
        const x = AI_TABLE_OFFSET + AI_TABLE_ROW_DRAG_ICON_WIDTH;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const width = this.rowHeadWidth - x + columnWidth;
        const expandWidth = this.showExpandRecordIcon ? AI_TABLE_ROW_HEAD_EXPAND_WIDTH : 0;
        const indexWidth = this.rowHeadWidth - x - expandWidth;
        this.rect({
            x: x + indexWidth,
            y: y + AI_TABLE_OFFSET,
            width: width - indexWidth,
            height: rowHeight - AI_TABLE_OFFSET * 2,
            fill
        });

        // 底部边框
        this.line({
            x: x,
            y: y,
            points: [0, rowHeight, width, rowHeight],
            stroke: this.colors.gray200
        });
        if (!this.hiddenIndexColumn) {
            // 垂直边框
            this.line({
                x: x,
                y: y,
                points: [indexWidth, 0, indexWidth, rowHeight],
                stroke: this.colors.gray200
            });
            // 右垂直边框
            this.line({
                x: x + indexWidth + expandWidth + columnWidth + AI_TABLE_OFFSET,
                y: y,
                points: [0, 0, 0, rowHeight],
                stroke: this.colors.gray200
            });

            if (this.readonly || (!isCheckedRow && !isHoverRow)) {
                // 设置字体样式，居中绘制行号
                this.setStyle({ fontSize: DEFAULT_FONT_SIZE });
                this.text({
                    x: x + indexWidth / 2 - AI_TABLE_CELL_LINE_BORDER,
                    y: y + AI_TABLE_FIELD_HEAD_HEIGHT / 2,
                    text: String((row as AITableLinearRowRecord).displayIndex),
                    textAlign: DEFAULT_TEXT_ALIGN_CENTER,
                    verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                });
            }
        }

        if (this.isLast) {
            this.renderAddFieldBlank({ isHoverRow, isCheckedRow });
        }
    }

    // 尾列
    private renderLastCell({ style, isHoverRow, isCheckedRow }: Pick<AITableCell, 'style' | 'isHoverRow' | 'isCheckedRow'>) {
        if (!this.isLast || this.isFirst) return;
        const { fill, stroke } = style || {};
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

        this.renderAddFieldBlank({ isHoverRow, isCheckedRow });
    }

    // 绘制中间的普通单元格
    private renderCommonCell({ style }: Pick<AITableCell, 'style'>) {
        if (this.isFirst || this.isLast) return;

        const { fill, stroke } = style || {};
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

    render(config: AITableCell) {
        const { row, style, indexStyle, isCheckedRow, isHoverRow } = config;
        this.renderFirstCell({ row, style, indexStyle, isCheckedRow, isHoverRow });
        this.renderCommonCell({ style });
        this.renderLastCell({ style, isCheckedRow, isHoverRow });
        this.renderFrozenShadow();
    }
}

export const recordLayout = new RecordLayout();
