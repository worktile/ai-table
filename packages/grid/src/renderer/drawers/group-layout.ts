import { AITableFieldType, isEmpty } from '@ai-table/utils';
import {
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_COMMON_FONT_SIZE,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_ROW_DRAG_ICON_WIDTH,
    AngleDownPath,
    AngleRightPath
} from '../../constants';
import { AITableCell, AITableLinearRowGroup, AITableRender } from '../../types';
import { Layout } from './layout-drawer';
import { cellDrawer } from './cell-drawer';
import { AITable, AITableGridI18nKey, getI18nTextByKey } from '../../utils';
import { hexToRgb } from 'ngx-tethys/util';

export class GroupLayout extends Layout {
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

    private renderFirstCell(render: AITableRender, config: AITableCell<AITableLinearRowGroup>) {
        if (!this.isFirst) return;
        const { row, indexStyle } = config;
        const { _id: recordId, type, depth = 0, groupValue, fieldId, isCollapsed } = row;
        const { field, style, aiTable } = render;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const { fill: indexFill } = indexStyle || {};

        const dragOccupyWidth = this.hiddenRowDrag || this.readonly ? 0 : AI_TABLE_ROW_DRAG_ICON_WIDTH;
        if (!this.hiddenIndexColumn) {
            this.customRect({
                x: AI_TABLE_OFFSET + dragOccupyWidth,
                y,
                width: this.rowHeadWidth - AI_TABLE_OFFSET - dragOccupyWidth,
                height: rowHeight,
                fill: indexFill,
                strokes: {
                    top: this.colors.gray200,
                    bottom: this.colors.gray200
                }
            });
            // 第一列单元格
            this.rect({
                x: AI_TABLE_CELL_PADDING + dragOccupyWidth + 2,
                y: this.y + (rowHeight - AI_TABLE_ICON_COMMON_SIZE) / 2,
                width: AI_TABLE_ICON_COMMON_SIZE,
                height: AI_TABLE_ICON_COMMON_SIZE,
                fill: hexToRgb(this.colors.gray400, 0.2),
                stroke: this.colors.gray300,
                radius: 2
            });
        }
        const iconContainerWidth = AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;
        if (!isEmpty(groupValue) || [AITableFieldType.checkbox, AITableFieldType.progress].includes(field.type as AITableFieldType)) {
            cellDrawer.initStyle(field, style);
            cellDrawer.renderCell(
                {
                    ...render,
                    x: render.x + iconContainerWidth,
                    columnWidth: render.columnWidth - iconContainerWidth,
                    isGroupFirstRender: true
                } as AITableRender,
                this.ctx as CanvasRenderingContext2D,
                columnWidth
            );
        } else {
            const emptyGroupString = getI18nTextByKey(aiTable, AITableGridI18nKey.emptyGroup);
            this.text({
                x: render.x + iconContainerWidth + AI_TABLE_CELL_PADDING,
                y: this.y + (rowHeight - AI_TABLE_COMMON_FONT_SIZE) / 2,
                text: emptyGroupString
            });
        }
    }

    private renderCommonCellBorder({ style }: Pick<AITableCell, 'style'>) {
        const { fill, stroke } = style || {};
        const colors = AITable.getColors();

        // 背景、边框
        this.customRect({
            x: this.x,
            y: this.y,
            width: this.columnWidth,
            height: this.rowHeight,
            fill: fill || colors.white,
            strokes: {
                top: stroke || colors.gray200,
                bottom: stroke || colors.gray200,
                right: this.isLastFrozenColumn ? this.colors.gray200 : undefined
            }
        });
    }

    private renderLastCell({ style, isHoverRow, isCheckedRow }: Pick<AITableCell, 'style' | 'isHoverRow' | 'isCheckedRow'>) {
        if (this.isLast) {
            this.renderAddFieldBlank({ isHoverRow: false, isCheckedRow: false });
        }
    }

    render(render: AITableRender, config: AITableCell<AITableLinearRowGroup>) {
        const { style, isHoverRow, isCheckedRow } = config;
        this.renderFirstCell(render, config);
        this.renderCommonCellBorder({ style });
        this.renderLastCell({ style, isHoverRow, isCheckedRow });
        this.renderFrozenShadow();
    }
}

export const groupLayout = new GroupLayout();
