import {
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
    AI_TABLE_CELL_MAX_ROW_COUNT,
    AI_TABLE_CELL_MULTI_DOT_RADIUS,
    AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_PADDING_LEFT,
    AI_TABLE_CELL_MULTI_PADDING_TOP,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_COMMON_FONT_SIZE,
    AI_TABLE_DOT_RADIUS,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_MIN_TEXT_WIDTH,
    AI_TABLE_OPTION_ITEM_FONT_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_PADDING,
    AI_TABLE_OPTION_ITEM_RADIUS,
    AI_TABLE_PIECE_RADIUS,
    AI_TABLE_PIECE_WIDTH,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_TEXT_GAP,
    Colors,
    DEFAULT_FONT_FAMILY,
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
import { getTextWidth } from '../../utils/get-text-width';

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

    private renderCellSelect(render: AITableRender, ctx?: any) {
        const { field } = render;
        if ((field as AITableSelectField).settings?.is_multiple) {
            this.renderCellMultiSelect(render, ctx);
        } else {
            this.renderSingleSelectCell(render, ctx);
        }
    }

    private renderCellMultiSelect(render: AITableRender, ctx?: any) {
        const { x, y, field, cellValue, columnWidth } = render;
        if (!cellValue?.length || !Array.isArray(cellValue)) return;
        let currentX = x + AI_TABLE_CELL_PADDING;
        const maxContainerWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const optionStyle = (field as AITableSelectField).settings.option_style;
        const fontStyle = `${DEFAULT_FONT_WEIGHT} ${AI_TABLE_OPTION_ITEM_FONT_SIZE}px ${DEFAULT_FONT_FAMILY}`;
        const isDotOrPiece = optionStyle === AITableSelectOptionStyle.dot || optionStyle === AITableSelectOptionStyle.piece;

        let totalWidth = 0;
        const cellItemInfoMap = new Map();
        let drawableIndex = 0;
        cellValue.forEach((optionId, index) => {
            const item = (field as AITableSelectField).settings.options?.find((option) => option._id === optionId);
            const textWidth = getTextWidth(ctx, item?.text as string, fontStyle);
            totalWidth += textWidth + 2 * AI_TABLE_CELL_PADDING;
            if (index < cellValue.length - 1) {
                totalWidth += AI_TABLE_CELL_MULTI_PADDING_LEFT;
            }
            if (isDotOrPiece) {
                totalWidth += AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT;
            }
            if (totalWidth < maxContainerWidth || totalWidth === maxContainerWidth) {
                drawableIndex = index;
            }

            cellItemInfoMap.set(optionId, { textWidth, item, offset: totalWidth });
        });

        const baseWidth = AI_TABLE_MIN_TEXT_WIDTH + AI_TABLE_CELL_PADDING * 2;
        const minWidth = isDotOrPiece ? baseWidth + AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT : baseWidth;
        if (cellValue[drawableIndex + 1]) {
            const { offset: offsetWidth } = cellItemInfoMap.get(cellValue[drawableIndex]);
            const { offset: nextOffset } = cellItemInfoMap.get(cellValue[drawableIndex + 1]);
            drawableIndex =
                maxContainerWidth - offsetWidth > minWidth && nextOffset > maxContainerWidth ? drawableIndex + 1 : drawableIndex;
            const number = cellValue.length - (drawableIndex + 1);
            if (number > 0) {
                const circleWidth = getTextWidth(ctx, `+{number}`, fontStyle) + 2 * AI_TABLE_CELL_PADDING;
                const max = maxContainerWidth - AI_TABLE_CELL_MULTI_PADDING_LEFT - circleWidth;
                drawableIndex = max - offsetWidth > minWidth && nextOffset > max ? drawableIndex : drawableIndex - 1;
            }
        }

        const circleText = `+${cellValue.length - (drawableIndex + 1)}`;
        const circleWidth =
            cellValue.length - (drawableIndex + 1) > 0 ? getTextWidth(ctx, circleText, fontStyle) + 2 * AI_TABLE_CELL_PADDING : 0;
        // 剩余空间
        let remainSpace = maxContainerWidth - circleWidth - (circleWidth > 0 ? AI_TABLE_CELL_MULTI_PADDING_LEFT : 0);

        for (let index = 0; index < cellValue.length; index++) {
            const optionId = cellValue[index];
            const bgConfig = {
                x: currentX,
                y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                height: AI_TABLE_OPTION_ITEM_HEIGHT,
                radius: AI_TABLE_PIECE_RADIUS,
                fill: Colors.gray100,
                width: 0
            };

            const commonItem = (optionStyle: AITableSelectOptionStyle, shape: string) => {
                const baseWidth = isDotOrPiece
                    ? AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT + AI_TABLE_CELL_PADDING * 2
                    : AI_TABLE_CELL_PADDING * 2;
                if (remainSpace < minWidth) {
                    return;
                }
                const { textWidth, item } = cellItemInfoMap.get(optionId);
                const completeWidth = baseWidth + textWidth;
                if (index !== cellValue.length - 1) {
                    remainSpace -= AI_TABLE_CELL_MULTI_PADDING_LEFT;
                }
                const bgWidth = remainSpace > completeWidth ? completeWidth : remainSpace;
                bgConfig.width = bgWidth;
                if (isDotOrPiece) {
                    this.rect(bgConfig);
                    if (shape === 'rect') {
                        this.rect({
                            x: bgConfig.x + AI_TABLE_CELL_PADDING,
                            y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_CELL_MULTI_DOT_RADIUS * 2) / 2,
                            width: AI_TABLE_CELL_MULTI_DOT_RADIUS * 2,
                            height: AI_TABLE_CELL_MULTI_DOT_RADIUS * 2,
                            radius: AI_TABLE_PIECE_RADIUS,
                            fill: item?.color ?? Colors.primary
                        });
                    } else if (shape === 'arc') {
                        this.arc({
                            x: bgConfig.x + AI_TABLE_CELL_PADDING,
                            y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_CELL_MULTI_DOT_RADIUS * 2) / 2 + AI_TABLE_CELL_MULTI_DOT_RADIUS,
                            radius: AI_TABLE_CELL_MULTI_DOT_RADIUS,
                            fill: item?.color ?? Colors.primary
                        });
                    }

                    this.text({
                        x: bgConfig.x + AI_TABLE_CELL_PADDING + AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT,
                        y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: this.textEllipsis({
                            text: item.text,
                            maxWidth: bgWidth - baseWidth,
                            fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                        }).text,
                        fillStyle: Colors.gray700,
                        fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                    });
                } else if (optionStyle === AITableSelectOptionStyle.tag) {
                    this.tag({
                        x: bgConfig.x,
                        y: bgConfig.y,
                        width: bgConfig.width,
                        text: this.textEllipsis({
                            text: item.text,
                            maxWidth: bgWidth - baseWidth,
                            fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                        }).text,
                        radius: AI_TABLE_OPTION_ITEM_RADIUS,
                        fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE,
                        height: bgConfig.height,
                        color: Colors.white,
                        padding: AI_TABLE_CELL_PADDING,
                        background: item?.color ?? Colors.primary
                    });
                } else {
                    this.rect(bgConfig);
                    this.text({
                        x: bgConfig.x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: this.textEllipsis({
                            text: item.text,
                            maxWidth: bgWidth - baseWidth,
                            fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                        }).text,
                        fillStyle: Colors.gray700,
                        fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                    });
                }
                const currentWidth = bgConfig.width;
                remainSpace -= currentWidth;
                currentX += currentWidth + AI_TABLE_CELL_MULTI_PADDING_LEFT;
            };

            switch (optionStyle) {
                case AITableSelectOptionStyle.dot:
                    commonItem(AITableSelectOptionStyle.dot, 'arc');
                    break;
                case AITableSelectOptionStyle.piece:
                    commonItem(AITableSelectOptionStyle.piece, 'rect');
                    break;
                case AITableSelectOptionStyle.tag:
                    commonItem(AITableSelectOptionStyle.tag, '');
                    break;
                default:
                    commonItem(AITableSelectOptionStyle.text, '');
                    break;
            }
        }

        if (circleWidth > 0) {
            if (optionStyle === AITableSelectOptionStyle.tag) {
                this.tag({
                    x: currentX,
                    y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                    width: circleWidth,
                    height: AI_TABLE_OPTION_ITEM_HEIGHT,
                    text: circleText,
                    background: Colors.gray100,
                    color: Colors.gray700,
                    radius: AI_TABLE_OPTION_ITEM_RADIUS,
                    padding: AI_TABLE_CELL_PADDING,
                    fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                });
            } else {
                this.rect({
                    x: currentX,
                    y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                    width: circleWidth,
                    height: AI_TABLE_OPTION_ITEM_HEIGHT,
                    fill: Colors.gray100,
                    radius: AI_TABLE_PIECE_RADIUS
                });
                this.text({
                    x: currentX + AI_TABLE_CELL_PADDING,
                    y: y + (AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                    text: circleText,
                    fillStyle: Colors.gray700,
                    fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                });
            }
        }
    }

    private renderSingleSelectCell(render: AITableRender, ctx?: any) {
        const { x, y, cellValue, field, columnWidth, isActive } = render;
        if (cellValue == null) {
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
