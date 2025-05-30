import {
    AI_TABLE_CELL_PADDING,
    AITableRender,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    CellDrawer,
    getFileThumbnailSvgString,
    DEFAULT_FONT_WEIGHT,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_CELL_MULTI_PADDING_LEFT
} from '@ai-table/grid';
import { isUndefinedOrNull } from 'ngx-tethys/util';
import { AITableCustomReferences } from '../../types/grid';

export function renderRelationCell(render: AITableRender<AITableCustomReferences>, drawer: CellDrawer) {
    const { references, x, y, field, transformValue, rowHeight, columnWidth, isActive, style } = render;
    if (isUndefinedOrNull(transformValue)) {
        return;
    }
    const fieldType = field.type;
    const itemHeight = 24;
    let currentX = AI_TABLE_CELL_PADDING;
    let currentY = (AI_TABLE_FIELD_HEAD_HEIGHT - itemHeight) / 2;
    const fontWeight = style?.fontWeight || DEFAULT_FONT_WEIGHT;
    let maxRelationContainerWidth = 240;
    const relationIconMarginLeft = 12;
    const relationIconWidth = 16;
    const relationIdentifierMarginLeft = 8;
    const relationTitleMarginLeft = 8;
    const relationTitleMarginRight = 18;
    const countContainerWidth = 42;

    if (transformValue.length <= 1) {
        maxRelationContainerWidth = Math.min(maxRelationContainerWidth, columnWidth - AI_TABLE_CELL_PADDING - relationTitleMarginRight);
    } else {
        maxRelationContainerWidth = Math.min(
            maxRelationContainerWidth,
            columnWidth - AI_TABLE_CELL_PADDING - relationTitleMarginRight - countContainerWidth
        );
    }

    const relationTextMaxWidth =
        maxRelationContainerWidth - relationIconMarginLeft - relationIconWidth - relationIdentifierMarginLeft - relationTitleMarginRight;

    for (const [index, relationId] of transformValue.entries()) {
        const relationInfo = references?.relations?.[relationId];
        if (relationInfo) {
            const { title, type, whole_identifier } = relationInfo;
            const { text: identifierText, textWidth: identifierTextWidth } = drawer.textEllipsis({
                text: whole_identifier,
                maxWidth: relationTextMaxWidth,
                fontWeight
            });

            const { text: titleText, textWidth: titleTextWidth } = drawer.textEllipsis({
                text: title,
                maxWidth: relationTextMaxWidth - identifierTextWidth - relationTitleMarginLeft,
                fontWeight
            });

            const relationWidth =
                identifierTextWidth +
                titleTextWidth +
                relationTitleMarginLeft +
                relationIconWidth +
                relationIconMarginLeft +
                relationIdentifierMarginLeft +
                relationTitleMarginRight;

            let showMoreCount = false;
            if (index < transformValue.length - 1) {
                if (currentX + relationWidth >= columnWidth - AI_TABLE_CELL_PADDING - 42) {
                    showMoreCount = true;
                }
            } else {
                if (currentX + relationWidth >= columnWidth - AI_TABLE_CELL_PADDING) {
                    showMoreCount = true;
                }
            }

            if (showMoreCount) {
                // 关联项背景绘制
                drawer.rect({
                    x: x + currentX,
                    y: y + currentY,
                    width: countContainerWidth,
                    height: itemHeight,
                    fill: drawer?.colors.gray100,
                    radius: 4
                });

                const countString = `+${transformValue.length - index}`;
                const { text: countText, textWidth: countTextWidth } = drawer.textEllipsis({
                    text: countString,
                    fontWeight
                });

                const textX = x + currentX + (countContainerWidth - countTextWidth) / 2;
                const textY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2;
                const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
                drawer.text({
                    x: textX,
                    y: textY,
                    text: countString,
                    textAlign,
                    fillStyle: drawer?.colors.gray600,
                    fontWeight,
                    textDecoration: DEFAULT_TEXT_DECORATION,
                    verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                });
                continue;
            }

            // 关联项背景绘制
            {
                drawer.rect({
                    x: x + currentX,
                    y: y + currentY,
                    width: relationWidth,
                    height: itemHeight,
                    // stroke: draw?.colors.gray100,
                    fill: drawer?.colors.gray100,
                    radius: 4
                });
            }
            // 关联项图标绘制
            {
                const iconX = x + currentX + relationIconMarginLeft;
                const iconY = y + currentY + (itemHeight - relationIconWidth) / 2;

                const img = new Image();
                img.src = '/assets/icons/工单.svg';
                drawer.image({
                    name: img.src,
                    x: iconX,
                    y: iconY,
                    url: img.src,
                    width: relationIconWidth,
                    height: relationIconWidth
                });
            }

            // 绘制 identifier 文本
            {
                const textX = x + currentX + relationIconMarginLeft + relationIconWidth + relationIdentifierMarginLeft;
                const textY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2;
                const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
                drawer.text({
                    x: textX,
                    y: textY,
                    text: identifierText,
                    textAlign,
                    fillStyle: drawer?.colors.gray600,
                    fontWeight,
                    textDecoration: DEFAULT_TEXT_DECORATION,
                    verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                });
            }

            // 绘制 title 文本
            {
                const textX =
                    x +
                    currentX +
                    relationIconMarginLeft +
                    relationIconWidth +
                    relationIdentifierMarginLeft +
                    identifierTextWidth +
                    relationTitleMarginLeft;
                const textY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2;
                const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
                drawer.text({
                    x: textX,
                    y: textY,
                    text: titleText,
                    textAlign,
                    fillStyle: drawer?.colors.gray800,
                    fontWeight,
                    textDecoration: DEFAULT_TEXT_DECORATION,
                    verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                });
            }

            currentX += relationWidth + AI_TABLE_CELL_MULTI_PADDING_LEFT;
        }
    }
}
