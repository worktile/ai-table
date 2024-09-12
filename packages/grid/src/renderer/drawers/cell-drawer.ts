import { hexToRgb } from 'ngx-tethys/util';
import {
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
    AI_TABLE_CELL_MAX_ROW_COUNT,
    AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_PADDING_TOP,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_OPTION_ITEM_FONT_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_PADDING,
    AI_TABLE_OPTION_ITEM_RADIUS,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_TEXT_ALIGN_CENTER,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ALIGN_RIGHT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_LINE_HEIGHT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
} from '../../constants';
import { AITable, AITableField, AITableFieldType, AITableSelectOptionStyle } from '../../core';
import { AITableRender, AITableSelectField } from '../../types';
import { Drawer } from './drawer';

/**
 * 处理和渲染表格单元格的内容
 */
export class CellHelper extends Drawer {
    // 样式初始化
    public initStyle(field: AITableField, styleProps: { fontWeight: any }): void | null {
        const { type: fieldType } = field;
        const { fontWeight = DEFAULT_FONT_WEIGHT } = styleProps;

        switch (fieldType) {
            case AITableFieldType.text: {
                return this.setStyle({ fontSize: DEFAULT_FONT_SIZE, fontWeight });
            }
            default:
                return null;
        }
    }

    // 单元格渲染
    public renderCell(render: AITableRender, ctx?: CanvasRenderingContext2D | undefined) {
        const { field } = render;
        const fieldType = field.type;

        switch (fieldType) {
            case AITableFieldType.text: {
                this.renderCellText(render, ctx);
                return;
            }
            case AITableFieldType.select: {
                this.renderCellSelect(render, ctx);
                return;
            }
            default:
                return null;
        }
    }

    // 文本类型渲染
    private renderCellText(render: AITableRender, ctx?: any) {
        const { x, y, cellValue, field, columnWidth, isActive, style } = render;

        let renderText: string | null = cellValue;

        if (renderText == null) {
            return;
        }

        const isSingleLine = !columnWidth;
        const fieldType = field.type;

        if (isSingleLine) {
            renderText = renderText.replace(/\r|\n/g, ' ');
        }

        const color = style?.color || this.colors.gray800;
        const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
        const fontWeight = style?.fontWeight;
        const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const renderX = textAlign === DEFAULT_TEXT_ALIGN_RIGHT ? x + columnWidth - AI_TABLE_CELL_PADDING : x + AI_TABLE_CELL_PADDING;
        const renderY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2;
        const textDecoration = DEFAULT_TEXT_DECORATION;

        this.wrapText({
            x: renderX,
            y: renderY,
            text: renderText,
            maxWidth: textMaxWidth,
            maxRow: isActive ? Infinity : AI_TABLE_CELL_MAX_ROW_COUNT,
            lineHeight: DEFAULT_TEXT_LINE_HEIGHT,
            textAlign,
            verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
            fillStyle: color,
            fontWeight,
            textDecoration,
            fieldType,
            needDraw: !isActive
        });
    }

    private renderCellSelect(render: AITableRender, ctx?: any) {
        const { field } = render;

        if ((field as AITableSelectField).settings?.is_multiple) {
            return;
        } else {
            this.renderSingleSelectCell(render, ctx);
        }
    }

    private renderSingleSelectCell(render: AITableRender, ctx?: any) {
        const { x, y, cellValue, field, columnWidth, isActive } = render;
        if (cellValue == null || cellValue.length === 0) {
            return;
        }
        const colors = AITable.getColors();
        const isOperating = isActive;
        const item = (field as AITableSelectField).settings.options?.find((option) => option._id === cellValue[0]);
        const itemName = item?.text || '';

        const optionStyle = (field as AITableSelectField).settings.option_style;
        let color = item?.color || colors.gray800;
        let background = item?.color ? hexToRgb(item?.color, 0.1) : colors.primary;
        switch (optionStyle) {
            case AITableSelectOptionStyle.dot:
            case AITableSelectOptionStyle.piece:
                color = item?.color || colors.gray700;
                background = item?.bg_color || colors.gray100;
                break;
            default:
                color = colors.white;
                background = item?.color ? item?.color : colors.primary;
                break;
        }

        let maxTextWidth = columnWidth - 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_OPTION_ITEM_PADDING);
        maxTextWidth -= isOperating ? AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE - AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET : 0;

        const { text, textWidth } = this.textEllipsis({
            text: itemName,
            maxWidth: columnWidth && maxTextWidth,
            fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
        });
        const width = Math.max(textWidth + 2 * AI_TABLE_OPTION_ITEM_PADDING, AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH);
        if (ctx) {
            ctx.save();
            ctx.globalAlpha = 1;

            this.tag({
                x: x + AI_TABLE_CELL_PADDING,
                y: y + AI_TABLE_CELL_MULTI_PADDING_TOP,
                width,
                height: AI_TABLE_OPTION_ITEM_HEIGHT,
                text,
                background,
                color,
                radius: AI_TABLE_OPTION_ITEM_RADIUS,
                padding: AI_TABLE_OPTION_ITEM_PADDING,
                fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE,
                stroke: background,
                textAlign: DEFAULT_TEXT_ALIGN_CENTER
            });
            ctx.restore();
        }
    }
}

export const cellHelper = new CellHelper();
