import {
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
    AI_TABLE_CELL_MAX_ROW_COUNT,
    AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_PADDING_TOP,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_COMMON_FONT_SIZE,
    AI_TABLE_DOT_RADIUS,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_OPTION_ITEM_FONT_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_PADDING,
    AI_TABLE_OPTION_ITEM_RADIUS,
    AI_TABLE_PIECE_RADIUS,
    AI_TABLE_PIECE_WIDTH,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_TEXT_GAP,
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
export class CellDrawer extends Drawer {
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
            case AITableFieldType.text:
            case AITableFieldType.number:
                this.renderCellText(render, ctx);
                return;
            case AITableFieldType.select:
                this.renderCellSelect(render, ctx);
                return;
            default:
                return null;
        }
    }

    private renderCellText(render: AITableRender, ctx?: any) {
        const { x, y, cellValue, field, columnWidth, isActive, style } = render;

        let renderText: string | null = cellValue;

        if (renderText == null) {
            return;
        }

        const fieldType = field.type;
        const isSingleLine = !columnWidth;
        const isTextField = fieldType === AITableFieldType.text;
        const isNumberField = fieldType === AITableFieldType.number;

        if (isTextField && isSingleLine) {
            renderText = renderText.replace(/\r|\n/g, ' ');
        }

        const color = style?.color || this.colors.gray800;
        const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
        const fontWeight = style?.fontWeight;
        const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const renderX = textAlign === DEFAULT_TEXT_ALIGN_RIGHT ? x + columnWidth - AI_TABLE_CELL_PADDING : x + AI_TABLE_CELL_PADDING;
        const renderY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2;
        const textDecoration = DEFAULT_TEXT_DECORATION;

        if (isNumberField) {
            renderText = String(renderText);
            const { text } = this.textEllipsis({
                text: renderText,
                maxWidth: columnWidth && textMaxWidth,
                fontWeight
            });
            if (ctx) {
                let pureText = text;
                this.text({
                    x: renderX,
                    y: renderY,
                    text: pureText,
                    textAlign,
                    fillStyle: color,
                    fontWeight,
                    textDecoration,
                    verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                });
            }
        } else {
            this.wrapText({
                x: renderX,
                y: renderY,
                text: renderText,
                maxWidth: textMaxWidth,
                maxRow: AI_TABLE_CELL_MAX_ROW_COUNT,
                lineHeight: DEFAULT_TEXT_LINE_HEIGHT,
                textAlign,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
                fillStyle: color,
                fontWeight,
                textDecoration,
                fieldType,
                needDraw: true
            });
        }
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
        const isOperating = isActive;
        const item = (field as AITableSelectField).settings.options?.find((option) => option._id === cellValue[0]);
        const itemName = item?.text || '';
        const getTextEllipsis = (maxTextWidth: number, fontSize: number = AI_TABLE_COMMON_FONT_SIZE) => {
            maxTextWidth -= isOperating ? AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE - AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET : 0;
            return this.textEllipsis({
                text: itemName,
                maxWidth: columnWidth && maxTextWidth,
                fontSize: fontSize
            });
        };
        if (ctx) {
            ctx.save();
            ctx.globalAlpha = 1;
            const colors = AITable.getColors();
            const optionStyle = (field as AITableSelectField).settings.option_style;
            let background = item?.color ?? colors.primary;
            const dotMaxTextWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PIECE_WIDTH - AI_TABLE_TEXT_GAP;
            switch (optionStyle) {
                case AITableSelectOptionStyle.dot:
                    this.arc({
                        x: x + AI_TABLE_CELL_PADDING + AI_TABLE_DOT_RADIUS,
                        y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_PIECE_WIDTH) / 2 + AI_TABLE_DOT_RADIUS,
                        radius: AI_TABLE_DOT_RADIUS,
                        fill: background
                    });
                    this.text({
                        x: x + AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(dotMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;
                case AITableSelectOptionStyle.piece:
                    this.rect({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_PIECE_WIDTH) / 2,
                        width: AI_TABLE_PIECE_WIDTH,
                        height: AI_TABLE_PIECE_WIDTH,
                        radius: AI_TABLE_PIECE_RADIUS,
                        fill: background
                    });
                    this.text({
                        x: x + AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(dotMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;

                case AITableSelectOptionStyle.tag:
                    const maxTextWidth = columnWidth - 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_OPTION_ITEM_PADDING);
                    const { textWidth, text } = getTextEllipsis(maxTextWidth, AI_TABLE_OPTION_ITEM_FONT_SIZE);
                    const width = Math.max(textWidth + 2 * AI_TABLE_OPTION_ITEM_PADDING, AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH);
                    this.tag({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + AI_TABLE_CELL_MULTI_PADDING_TOP,
                        width,
                        height: AI_TABLE_OPTION_ITEM_HEIGHT,
                        text,
                        background,
                        color: colors.white,
                        radius: AI_TABLE_OPTION_ITEM_RADIUS,
                        padding: AI_TABLE_OPTION_ITEM_PADDING,
                        fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE,
                        stroke: background,
                        textAlign: DEFAULT_TEXT_ALIGN_CENTER
                    });
                    break;
                default:
                    const textMaxTextWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
                    this.text({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(textMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;
            }

            ctx.restore();
        }
    }
}

export const cellDrawer = new CellDrawer();
