import {
    AI_TABLE_CELL_MAX_ROW_COUNT,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ALIGN_RIGHT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_LINE_HEIGHT,
    DEFAULT_TEXT_MAX_HEIGHT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
} from '../../constants';
import { AITableField, AITableFieldType } from '../../core';
import { AITableRender, AITableWrapTextData } from '../../types';
import { Drawer } from '../../utils/drawer';

const DEFAULT_RENDER_DATA = {
    width: 0,
    height: 0,
    isOverflow: false,
    renderContent: null
};

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
                return this.renderCellText(render, ctx);
            }
            default:
                return null;
        }
    }

    // 文本类型渲染
    private renderCellText(render: AITableRender, ctx?: any) {
        const { x, y, cellValue, field, columnWidth, style } = render;

        let renderText: string | null = cellValue;

        if (renderText == null) return DEFAULT_RENDER_DATA;

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
        let textHeight = 24;
        let textData: AITableWrapTextData | null = null;

        const result = this.wrapText({
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
        textHeight = result.height;
        textData = result.data;

        const renderContent = {
            x: AI_TABLE_CELL_PADDING,
            y: AI_TABLE_CELL_PADDING,
            width: textMaxWidth,
            height: textHeight,
            text: renderText,
            textData,
            style: {
                ...style,
                textAlign,
                textDecoration
            }
        };
        return {
            width: columnWidth,
            height: textHeight + AI_TABLE_CELL_PADDING,
            isOverflow: textHeight > DEFAULT_TEXT_MAX_HEIGHT,
            renderContent
        };
    }
}

export const cellHelper = new CellHelper();
