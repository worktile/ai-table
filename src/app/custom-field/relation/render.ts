import {
    AI_TABLE_CELL_PADDING,
    AITableRender,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    CellDrawer,
    DEFAULT_FONT_WEIGHT,
    Colors,
    AI_TABLE_ROW_BLANK_HEIGHT
} from '@ai-table/grid';
import { isUndefinedOrNull } from 'ngx-tethys/util';
import { AITableCustomReferences } from '../../types/grid';

export function renderRelationCell(
    render: AITableRender<AITableCustomReferences>,
    ctx: CanvasRenderingContext2D | undefined,
    drawer: CellDrawer
) {
    const { references, x, y, field, transformValue, rowHeight, columnWidth, isActive, style } = render;
    if (isUndefinedOrNull(transformValue)) {
        return;
    }
    const { text } = drawer.textEllipsis({
        text: transformValue,
        maxWidth: columnWidth - AI_TABLE_CELL_PADDING * 2,
        fontWeight: style?.fontWeight || DEFAULT_FONT_WEIGHT
    });
    const renderX = x + AI_TABLE_CELL_PADDING;
    const renderY = y + AI_TABLE_ROW_BLANK_HEIGHT / 2;
    const textDecoration = DEFAULT_TEXT_DECORATION;
    drawer.text({
        x: renderX,
        y: renderY,
        text: text,
        textAlign: style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT,
        fillStyle: style?.color || Colors.gray800,
        fontWeight: style?.fontWeight || DEFAULT_FONT_WEIGHT,
        textDecoration,
        verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
    });
}
