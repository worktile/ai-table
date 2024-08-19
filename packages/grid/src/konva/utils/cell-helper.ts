import { AITableField, AITableFieldType } from '@ai-table/grid';
import { DefaultTheme } from '../constants/default-theme';
import { GRID_CELL_VALUE_PADDING, RowHeightLevel } from '../constants/grid';
import { AITableRender, AITableWrapTextData } from '../interface/grid';
import { KonvaDrawer } from './drawer';

const getMaxLine = (rowHeightLevel: RowHeightLevel) => {
    switch (rowHeightLevel) {
        case RowHeightLevel.short:
            return 1;
        case RowHeightLevel.medium:
            return 2;
        case RowHeightLevel.tall:
            return 4;
        case RowHeightLevel.extraTall:
            return 6;
    }
};

const DEFAULT_RENDER_DATA = {
    width: 0,
    height: 0,
    isOverflow: false,
    renderContent: null
};

export class CellHelper extends KonvaDrawer {
    public initStyle(field: AITableField, styleProps: { fontWeight: any }): void | null {
        const { type: fieldType } = field;
        const { fontWeight = 'normal' } = styleProps;

        switch (fieldType) {
            case AITableFieldType.text:
            case AITableFieldType.createdAt:
            case AITableFieldType.updatedAt: {
                return this.setStyle({ fontSize: 13, fontWeight });
            }
            default:
                return null;
        }
    }

    public renderCellValue(render: AITableRender, ctx?: CanvasRenderingContext2D | undefined) {
        const { field } = render;
        const fieldType = field.type;

        switch (fieldType) {
            case AITableFieldType.text: {
                return this.renderCellText(render, ctx);
            }
            case AITableFieldType.createdAt:
            case AITableFieldType.updatedAt: {
                return this.renderCellDateTime(render, ctx);
            }
            default:
                return null;
        }
    }

    private renderCellText(render: AITableRender, ctx?: any) {
        const { x, y, cellValue, field, columnWidth, rowHeightLevel, style } = render;

        let renderText: string | null = cellValue;

        if (renderText == null) return DEFAULT_RENDER_DATA;

        const isSingleLine = rowHeightLevel === RowHeightLevel.short || !columnWidth;
        const fieldType = field.type;

        if (isSingleLine) {
            renderText = renderText.replace(/\r|\n/g, ' ');
        }

        const color = style?.color || this.colors.firstLevelText;
        const textAlign = style?.textAlign || 'left';
        const fontWeight = style?.fontWeight;
        const textMaxWidth = columnWidth - 2 * GRID_CELL_VALUE_PADDING;
        const renderX = textAlign === 'right' ? x + columnWidth - GRID_CELL_VALUE_PADDING : x + GRID_CELL_VALUE_PADDING;
        const renderY = y + 10;
        const textDecoration = 'none';
        let textHeight = 24;
        let textData: AITableWrapTextData | null = null;

        const result = this.wrapText({
            x: renderX,
            y: renderY,
            text: renderText,
            maxWidth: textMaxWidth,
            maxRow: getMaxLine(rowHeightLevel),
            lineHeight: 24,
            textAlign,
            fillStyle: color,
            fontWeight,
            textDecoration,
            fieldType,
            needDraw: true
        });
        textHeight = result.height;
        textData = result.data;

        const renderContent = {
            x: GRID_CELL_VALUE_PADDING,
            y: GRID_CELL_VALUE_PADDING,
            width: textMaxWidth,
            height: textHeight,
            text: renderText,
            favicon: '',
            textData,
            style: {
                ...style,
                textAlign,
                textDecoration
            }
        };
        return {
            width: columnWidth,
            height: textHeight + GRID_CELL_VALUE_PADDING,
            isOverflow: textHeight > 130,
            renderContent
        };
    }

    private renderCellDateTime(render: AITableRender, ctx?: any) {
        const colors = DefaultTheme.color;
        const { x, y, cellValue, field, columnWidth, style } = render;
        const cellString = cellValue;
        // const [date, time, timeRule, abbr] = cellString ? cellString.split(' ') : [];
        let cellText = cellValue;
        let abbrWidth = 0;

        if (cellText == null) return DEFAULT_RENDER_DATA;

        const textMaxWidth = columnWidth - 2 * GRID_CELL_VALUE_PADDING - abbrWidth;
        const { text, textWidth } = this.textEllipsis({ text: cellText, maxWidth: columnWidth && textMaxWidth });

        if (ctx) {
            const color = style?.color || colors.firstLevelText;
            this.text({
                x: x + GRID_CELL_VALUE_PADDING,
                y: y + GRID_CELL_VALUE_PADDING,
                text,
                fillStyle: color,
                fontWeight: style?.fontWeight
            });
        }

        const renderContent = {
            x: GRID_CELL_VALUE_PADDING,
            y: GRID_CELL_VALUE_PADDING,
            width: textMaxWidth,
            height: 24,
            text: text,
            style
        };

        return {
            width: columnWidth,
            height: 24,
            isOverflow: false,
            renderContent
        };
    }
}

export const cellHelper = new CellHelper();
