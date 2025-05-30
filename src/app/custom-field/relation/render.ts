import {
    AI_TABLE_CELL_ADD_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_MAX_ROW_COUNT,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ITEM_MARGIN_RIGHT,
    AI_TABLE_FILE_ICON_ITEM_HEIGHT,
    AI_TABLE_FILE_ICON_SIZE,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AITableRender,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_LINE_HEIGHT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    CellDrawer,
    getFileThumbnailSvgString
} from '@ai-table/grid';
import { isUndefinedOrNull } from 'ngx-tethys/util';
import { AITableCustomReferences } from '../../types/grid';

export function renderRelationCell(render: AITableRender<AITableCustomReferences>, draw?: CellDrawer) {
    const { references, x, y, field, transformValue, rowHeight, columnWidth, isActive, style } = render;
    if (isUndefinedOrNull(transformValue)) {
        return;
    }

    const fileIconSize = AI_TABLE_FILE_ICON_SIZE;
    const itemHeight = AI_TABLE_FILE_ICON_ITEM_HEIGHT;
    const isOperating = isActive;

    let currentX = AI_TABLE_CELL_PADDING;
    let currentY = (AI_TABLE_ROW_BLANK_HEIGHT - itemHeight) / 2;
    const itemOtherWidth = fileIconSize + AI_TABLE_FIELD_ITEM_MARGIN_RIGHT;
    const maxTextWidth = isOperating
        ? columnWidth - 2 * AI_TABLE_CELL_PADDING - itemOtherWidth - AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE - 12
        : columnWidth - 2 * AI_TABLE_CELL_PADDING - itemOtherWidth;

    const color = style?.color || draw?.colors.gray800;
    const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
    const fontWeight = style?.fontWeight;

    const listCount = transformValue.length;
    for (let index = 0; index < listCount; index++) {
        const relationInfo = references?.relations?.[transformValue[index]];
        if (!relationInfo) continue;
        const { title, addition } = relationInfo;
        const itemWidth = AI_TABLE_FILE_ICON_SIZE + AI_TABLE_FIELD_ITEM_MARGIN_RIGHT;
        currentX = AI_TABLE_CELL_PADDING + index * itemWidth;
        let realMaxTextWidth = maxTextWidth < 0 ? 0 : maxTextWidth;
        if (index === 0 && isOperating) {
            const operatingMaxWidth = maxTextWidth - (AI_TABLE_CELL_ADD_ITEM_BUTTON_SIZE + 4);
            realMaxTextWidth = operatingMaxWidth;
        }
        if (columnWidth != null) {
            // 在非活动状态下，当超出列宽时，不会渲染后续内容
            if (currentX >= columnWidth - 2 * AI_TABLE_CELL_PADDING) {
                break;
            }
        }
        const svgString = getFileThumbnailSvgString(addition?.ext);
        const img = new Image();
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
        if (draw?.ctx) {
            draw.image({
                name: img.src,
                x: x + currentX,
                y: y + currentY,
                url: img.src,
                width: AI_TABLE_FILE_ICON_SIZE,
                height: AI_TABLE_FILE_ICON_SIZE
            });
            draw.wrapText({
                x: x + currentX + 30,
                y: y + currentY + 10,
                text: 'ceshi ',
                maxWidth: 400,
                maxRow: AI_TABLE_CELL_MAX_ROW_COUNT,
                lineHeight: DEFAULT_TEXT_LINE_HEIGHT,
                textAlign: 'left',
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
                fontWeight,
                textDecoration: DEFAULT_TEXT_DECORATION,
                fieldType: field.type,
                needDraw: true
            });
        }
    }
}
