import { isUndefinedOrNull } from 'ngx-tethys/util';
import {
    Colors,
    Drawer,
    CellDrawer,
    AITableText,
    FONT_SIZE_SM,
    AITableRender,
    AddOutlinedPath,
    AI_TABLE_OFFSET,
    DEFAULT_FONT_WEIGHT,
    AI_TABLE_CELL_PADDING,
    DEFAULT_TEXT_DECORATION,
    AITableActionIconConfig,
    DEFAULT_TEXT_ALIGN_LEFT,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_CELL_MULTI_PADDING_LEFT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AI_TABLE_CELL_MULTI_ITEM_MARGIN_LEFT,
    AITableRect
} from '@ai-table/grid';
import { AITableReferences } from '@ai-table/utils';
import {
    closeIconPath,
    RelationFieldType,
    AITableCustomReferences,
    RelationConfig,
    RelationHeaderType,
    RelationMoreCountInfo
} from './types';

export function renderRelationCell(render: AITableRender<AITableReferences>, drawer: CellDrawer) {
    const { transformValue, field } = render;
    if (isUndefinedOrNull(transformValue)) {
        return;
    }
    let options = {
        headerType: RelationHeaderType.icon,
        showAddAction: false,
        multilineRow: false,
        showClose: false
    };
    if (field.type === RelationFieldType.relationObjective) {
        options.headerType = RelationHeaderType.tag;
    }
    const { relationItems, moreCount } = getRelationItemsConfigs(render, drawer, options);
    if (relationItems.length > 0) {
        for (const relationItem of relationItems) {
            drawer.rect(relationItem.bgRect as AITableRect);
            if (relationItem.whole_identifier) {
                drawer.text(relationItem.whole_identifier);
            }
            if (relationItem.title) {
                drawer.text(relationItem.title);
            }
            if (relationItem.icon) {
                drawer.image({
                    ...relationItem.icon,
                    name: relationItem.icon.url
                });
            }
            if (relationItem.tag) {
                drawer.rect(relationItem.tag.bgRect);
                drawer.text(relationItem.tag.text);
            }
        }
    }
    if (moreCount) {
        drawer.rect(moreCount.bgRect);
        drawer.text(moreCount.text);
    }
}

export function getRelationItemsConfigs(
    render: AITableRender<AITableReferences>,
    drawer: Drawer,
    options: {
        headerType: RelationHeaderType;
        showAddAction: boolean;
        multilineRow: boolean;
        showClose: boolean;
    } = {
        headerType: RelationHeaderType.icon,
        showAddAction: false,
        multilineRow: false,
        showClose: false
    }
) {
    const { showAddAction, multilineRow, headerType, showClose } = options;
    const { references, x, y, field, transformValue = [], rowHeight, columnWidth, isActive, style } = render;
    const itemHeight = 24;
    let currentX = AI_TABLE_CELL_PADDING;
    let currentY = (AI_TABLE_FIELD_HEAD_HEIGHT - itemHeight) / 2;
    const fontWeight = style?.fontWeight || DEFAULT_FONT_WEIGHT;
    const maxRelationContainerWidth = 9999;
    const minRelationContainerWidth = 100;
    const closeContainerWidth = 10;
    const fontSize = FONT_SIZE_SM;
    const relationHeaderMarginLeft = 12;
    let relationHeaderWidth = 14;

    let relationIdentifierMarginLeft = 4;
    const relationTitleMarginLeft = 4;
    const relationTitleMarginRight = 18;
    const relationItemHeight = 30;
    let countContainerWidth = 42 + AI_TABLE_CELL_MULTI_PADDING_LEFT;
    if (multilineRow) {
        countContainerWidth = 0;
    }

    const relationItems: RelationConfig[] = [];
    let moreCount: RelationMoreCountInfo | null = null;

    const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;

    let rowIndex = 0;
    for (const [index, relationId] of transformValue.entries()) {
        let relationInfo = undefined as (ReturnType<typeof Object> & any) | undefined;
        relationInfo = (references as AITableCustomReferences)?.[field.type as RelationFieldType]?.[relationId];

        if (relationInfo) {
            const { title: titleString, type, whole_identifier, name } = relationInfo;
            if (!whole_identifier) {
                relationIdentifierMarginLeft = 0;
            }
            const relationItem: RelationConfig = {
                relationInfo
            };

            let tagString = '';
            let tagStringWidth = 0;

            if (headerType === RelationHeaderType.tag && field.type === RelationFieldType.relationObjective) {
                const { text: number, textWidth: numberWidth } = drawer.textEllipsis({
                    text: `O${relationInfo.number}`,
                    fontSize: fontSize,
                    fontWeight
                });
                tagString = number;
                tagStringWidth = numberWidth;
                relationHeaderWidth = numberWidth + 20;
            }

            let { relationContainerWidth, remainingWidth } = getNewRowWidth(
                columnWidth,
                currentX,
                showAddAction || false,
                maxRelationContainerWidth
            );

            let showMoreCount = false;
            if (index < transformValue.length - 1) {
                relationContainerWidth = Math.min(remainingWidth - countContainerWidth, maxRelationContainerWidth);

                if (relationContainerWidth < minRelationContainerWidth) {
                    if (multilineRow) {
                        rowIndex++;
                        currentX = AI_TABLE_CELL_PADDING;
                        currentY += relationItemHeight;
                        let { relationContainerWidth: newRelationContainerWidth, remainingWidth: newRemainingWidth } = getNewRowWidth(
                            columnWidth,
                            currentX,
                            showAddAction || false,
                            maxRelationContainerWidth
                        );
                        relationContainerWidth = newRelationContainerWidth;
                        remainingWidth = newRemainingWidth;
                    } else {
                        showMoreCount = true;
                    }
                }
            } else {
                if (remainingWidth < minRelationContainerWidth) {
                    if (multilineRow) {
                        rowIndex++;
                        currentX = AI_TABLE_CELL_PADDING;
                        currentY += relationItemHeight;
                        let { relationContainerWidth: newRelationContainerWidth, remainingWidth: newRemainingWidth } = getNewRowWidth(
                            columnWidth,
                            currentX,
                            showAddAction || false,
                            maxRelationContainerWidth
                        );
                        relationContainerWidth = newRelationContainerWidth;
                        remainingWidth = newRemainingWidth;
                    } else {
                        showMoreCount = true;
                    }
                }
            }

            if (showMoreCount && !multilineRow) {
                const countString = `+${transformValue.length - index}`;
                const { text: countText, textWidth: countTextWidth } = drawer.textEllipsis({
                    text: countString,
                    fontSize: fontSize,
                    fontWeight
                });

                const textX = x + currentX + (countContainerWidth - countTextWidth) / 2;
                const textY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2;
                moreCount = {
                    bgRect: {
                        x: x + currentX,
                        y: y + currentY,
                        width: countContainerWidth,
                        height: itemHeight,
                        fill: drawer?.colors.gray100,
                        radius: 4
                    },
                    text: {
                        x: textX,
                        y: textY,
                        text: countString,
                        textAlign,
                        fontSize: fontSize,
                        fillStyle: drawer?.colors.gray800,
                        fontWeight,
                        textDecoration: DEFAULT_TEXT_DECORATION,
                        verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                    }
                };
                break;
            }

            let relationTextMaxWidth =
                relationContainerWidth -
                relationHeaderMarginLeft -
                relationHeaderWidth -
                relationIdentifierMarginLeft -
                relationTitleMarginRight;

            if (showClose) {
                relationTextMaxWidth -= closeContainerWidth;
            }

            let identifierText = '';
            let identifierTextWidth = 0;
            if (whole_identifier) {
                const { text, textWidth } = drawer.textEllipsis({
                    text: whole_identifier,
                    maxWidth: relationTextMaxWidth,
                    fontSize: fontSize,
                    fontWeight
                });
                identifierText = text;
                identifierTextWidth = textWidth;
            }

            let titleText = '';
            let titleTextWidth = 0;
            const titleContainerMaxWidth = relationTextMaxWidth - identifierTextWidth - relationTitleMarginLeft;
            if (identifierTextWidth < relationTextMaxWidth && titleContainerMaxWidth > 15) {
                const titleTextInfo = drawer.textEllipsis({
                    text: titleString || name || '',
                    maxWidth: relationTextMaxWidth - identifierTextWidth - relationTitleMarginLeft,
                    fontSize: fontSize,
                    fontWeight
                });
                titleText = titleTextInfo.text;
                titleTextWidth = titleTextInfo.textWidth;
            }

            let relationWidth =
                identifierTextWidth +
                titleTextWidth +
                relationTitleMarginLeft +
                relationHeaderWidth +
                relationHeaderMarginLeft +
                relationIdentifierMarginLeft +
                relationTitleMarginRight;

            if (showClose) {
                relationWidth += closeContainerWidth;
            }

            const bgRect = {
                x: x + currentX,
                y: y + currentY,
                width: relationWidth,
                height: itemHeight,
                fill: drawer?.colors.gray100,
                radius: 4
            };
            relationItem.bgRect = bgRect;

            if (headerType === RelationHeaderType.tag) {
                const textX = x + currentX + relationHeaderMarginLeft + (relationHeaderWidth - tagStringWidth) / 2;
                const textY = y + rowIndex * relationItemHeight + AI_TABLE_FIELD_HEAD_HEIGHT / 2;
                const tag: {
                    bgRect: AITableRect;
                    text: AITableText;
                } = {
                    bgRect: {
                        x: x + currentX + relationHeaderMarginLeft,
                        y: y + currentY + (itemHeight - 16) / 2,
                        width: relationHeaderWidth,
                        height: 16,
                        fill: hexToRgba(relationInfo.color, 0.1),
                        radius: 18
                    },
                    text: {
                        x: textX,
                        y: textY,
                        text: tagString,
                        textAlign,
                        fillStyle: relationInfo.color,
                        fontWeight,
                        fontSize: fontSize,
                        textDecoration: DEFAULT_TEXT_DECORATION as any,
                        verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE as any
                    }
                };
                relationItem.tag = tag;
            }

            if (headerType === RelationHeaderType.icon) {
                const iconX = x + currentX + relationHeaderMarginLeft;
                const iconY = y + currentY + (itemHeight - relationHeaderWidth) / 2;

                const svgString = (references as AITableCustomReferences)?.svgMap?.[relationId] || '';
                let url = '';
                if (svgString) {
                    url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
                }
                const icon = {
                    x: iconX,
                    y: iconY,
                    url,
                    width: relationHeaderWidth,
                    height: relationHeaderWidth
                };
                relationItem.icon = icon;
            }

            // 绘制 identifier 文本
            const identifierX = x + currentX + relationHeaderMarginLeft + relationHeaderWidth + relationIdentifierMarginLeft;
            const identifierY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2 + AI_TABLE_OFFSET + rowIndex * relationItemHeight;
            const identifier: AITableText = {
                x: identifierX,
                y: identifierY,
                text: identifierText,
                textAlign,
                fillStyle: drawer?.colors.gray600,
                fontWeight,
                fontSize: fontSize,
                textDecoration: DEFAULT_TEXT_DECORATION,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
            };
            relationItem.whole_identifier = identifier;

            // 绘制 title 文本
            const titleX =
                x +
                currentX +
                relationHeaderMarginLeft +
                relationHeaderWidth +
                relationIdentifierMarginLeft +
                identifierTextWidth +
                relationTitleMarginLeft;
            const titleY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2 + AI_TABLE_OFFSET + rowIndex * relationItemHeight;

            const title: AITableText = {
                x: titleX,
                y: titleY,
                text: titleText,
                textAlign,
                fillStyle: drawer?.colors.gray800,
                fontWeight,
                fontSize: fontSize,
                textDecoration: DEFAULT_TEXT_DECORATION,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
            };
            relationItem.title = title;

            if (showClose) {
                const closeX = x + currentX + relationWidth - itemHeight;
                const closeY = y + currentY;
                const closeActionConfig: Partial<AITableActionIconConfig> = {
                    x: closeX,
                    y: closeY,
                    data: closeIconPath,
                    fill: Colors.gray600,
                    hoverFill: '#ff5b57',
                    size: 12,
                    backgroundWidth: itemHeight,
                    backgroundHeight: itemHeight,
                    cornerRadius: AI_TABLE_ACTION_COMMON_RADIUS,
                    listening: true
                };
                relationItem.closeActionConfig = closeActionConfig as AITableActionIconConfig;
            }
            currentX += relationWidth + AI_TABLE_CELL_MULTI_PADDING_LEFT;

            relationItems.push(relationItem);
        }
    }

    const offsetX = render.columnWidth - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
    const offsetY = (rowHeight - AI_TABLE_ACTION_COMMON_SIZE) / 2;

    const addActionConfig: Partial<AITableActionIconConfig> = {
        x: offsetX,
        y: offsetY,
        data: AddOutlinedPath,
        fill: Colors.gray600,
        hoverFill: Colors.primary,
        backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
        backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
        cornerRadius: AI_TABLE_ACTION_COMMON_RADIUS,
        listening: true
    };

    const totalHeight = rowHeight + rowIndex * relationItemHeight - AI_TABLE_OFFSET * 2;

    const result = {
        relationItems,
        moreCount,
        addActionConfig: showAddAction ? addActionConfig : null,
        totalHeight
    };

    return result;
}

function getNewRowWidth(columnWidth: number, currentX: number, showAddAction: boolean, maxRelationContainerWidth: number) {
    let remainingWidth = columnWidth - currentX;
    if (showAddAction) {
        remainingWidth += -AI_TABLE_CELL_MULTI_ITEM_MARGIN_LEFT - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
    } else {
        remainingWidth += -AI_TABLE_CELL_PADDING;
    }

    let relationContainerWidth = Math.min(remainingWidth, maxRelationContainerWidth);
    return { relationContainerWidth, remainingWidth };
}

function hexToRgba(hex: string, opacity: number = 1) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
