import {
    AI_TABLE_CELL_PADDING,
    AITableRender,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    CellDrawer,
    DEFAULT_FONT_WEIGHT,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_CELL_MULTI_PADDING_LEFT,
    Drawer,
    AITableText,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AddOutlinedPath,
    Colors,
    AI_TABLE_ACTION_COMMON_RADIUS,
    AITableActionIconConfig,
    AI_TABLE_OFFSET
} from '@ai-table/grid';
import { isUndefinedOrNull } from 'ngx-tethys/util';
import { AITableCustomReferences } from '../../types/grid';
import { AITableCustomFieldType, MoreCountItem, RelationItem } from '../../types/field';
import { RELATION_ICON_MAP } from '../../constants/field';

export function renderRelationCell(render: AITableRender<AITableCustomReferences>, drawer: CellDrawer) {
    const { references, x, y, field, transformValue, rowHeight, columnWidth, isActive, style } = render;
    if (isUndefinedOrNull(transformValue)) {
        return;
    }
    const { relationItems, moreCount } = getRelationItemsConfigs(render, drawer);
    if (relationItems.length > 0) {
        for (const relationItem of relationItems) {
            drawer.rect(relationItem.bgRect);
            drawer.text(relationItem.identifier);
            relationItem.title && drawer.text(relationItem.title);
            drawer.image({
                ...relationItem.icon,
                name: relationItem.icon.url
            });
        }
    }
    if (moreCount) {
        drawer.rect(moreCount.bgRect);
        drawer.text(moreCount.text);
    }
}

export function getRelationItemsConfigs(
    render: AITableRender<AITableCustomReferences>,
    drawer: Drawer,
    options?: {
        showAddAction?: boolean;
        multilineRow?: boolean;
    }
) {
    const showAddAction = options?.showAddAction;
    const multilineRow = options?.multilineRow;
    const { references, x, y, field, transformValue = [], rowHeight, columnWidth, isActive, style } = render;
    const itemHeight = 24;
    let currentX = AI_TABLE_CELL_PADDING;
    let currentY = (AI_TABLE_FIELD_HEAD_HEIGHT - itemHeight) / 2;
    const fontWeight = style?.fontWeight || DEFAULT_FONT_WEIGHT;
    let maxRelationContainerWidth = 240; // 最大关联项容器宽度
    let minRelationContainerWidth = 128; // 最小关联项容器宽度
    const relationIconMarginLeft = 12;
    const relationIconWidth = 16;
    const relationIdentifierMarginLeft = 8;
    const relationTitleMarginLeft = 8;
    const relationTitleMarginRight = 18;
    const relationItemHeight = 30;
    let countContainerWidth = 42 + AI_TABLE_CELL_MULTI_PADDING_LEFT;
    if (multilineRow) {
        countContainerWidth = 0;
    }

    const relationItems: RelationItem[] = [];
    let moreCount: MoreCountItem | null = null;

    const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;

    let rowIndex = 0;
    for (const [index, relationId] of transformValue.entries()) {
        const relationInfo = references?.relations?.[relationId];
        if (relationInfo) {
            // 剩余宽度
            let { relationContainerWidth, remainingWidth } = getNewRowWidth(
                columnWidth,
                currentX,
                showAddAction || false,
                maxRelationContainerWidth
            );

            // 是否显示更多计数
            let showMoreCount = false;
            if (index < transformValue.length - 1) {
                // 后续还有元素
                relationContainerWidth = Math.min(remainingWidth - countContainerWidth, maxRelationContainerWidth);

                if (relationContainerWidth < minRelationContainerWidth) {
                    // 容纳不下则 换行 或 展示count
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
                // 最后一个元素
                if (remainingWidth < minRelationContainerWidth) {
                    // 容纳不下这一条，换行 或 展示count
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

            // 不换行 需要渲染 count，则结束
            if (showMoreCount && !multilineRow) {
                // 关联项背景绘制
                const countString = `+${transformValue.length - index}`;
                const { text: countText, textWidth: countTextWidth } = drawer.textEllipsis({
                    text: countString,
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
                        fillStyle: drawer?.colors.gray800,
                        fontWeight,
                        textDecoration: DEFAULT_TEXT_DECORATION,
                        verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                    }
                };
                continue;
            }

            const relationTextMaxWidth =
                relationContainerWidth -
                relationIconMarginLeft -
                relationIconWidth -
                relationIdentifierMarginLeft -
                relationTitleMarginRight;

            const { title: titleString, type, whole_identifier } = relationInfo;
            const { text: identifierText, textWidth: identifierTextWidth } = drawer.textEllipsis({
                text: whole_identifier,
                maxWidth: relationTextMaxWidth,
                fontWeight
            });

            const { text: titleText, textWidth: titleTextWidth } = drawer.textEllipsis({
                text: titleString,
                maxWidth: relationTextMaxWidth - identifierTextWidth - relationTitleMarginLeft,
                // maxWidth: 1,
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

            // 关联项背景绘制
            const bgRect = {
                x: x + currentX,
                y: y + currentY,
                width: relationWidth,
                height: itemHeight,
                fill: drawer?.colors.gray100,
                radius: 4
            };

            // 关联项图标绘制
            const iconX = x + currentX + relationIconMarginLeft;
            const iconY = y + currentY + (itemHeight - relationIconWidth) / 2;

            const icon = {
                x: iconX,
                y: iconY,
                url: RELATION_ICON_MAP[field.type as AITableCustomFieldType],
                width: relationIconWidth,
                height: relationIconWidth
            };

            // 绘制 identifier 文本
            const identifierX = x + currentX + relationIconMarginLeft + relationIconWidth + relationIdentifierMarginLeft;
            const identifierY = y + AI_TABLE_FIELD_HEAD_HEIGHT / 2 + AI_TABLE_OFFSET + rowIndex * relationItemHeight;
            const identifier: AITableText = {
                x: identifierX,
                y: identifierY,
                text: identifierText,
                textAlign,
                fillStyle: drawer?.colors.gray600,
                fontWeight,
                textDecoration: DEFAULT_TEXT_DECORATION,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
            };

            // 绘制 title 文本
            const titleX =
                x +
                currentX +
                relationIconMarginLeft +
                relationIconWidth +
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
                textDecoration: DEFAULT_TEXT_DECORATION,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
            };

            currentX += relationWidth + AI_TABLE_CELL_MULTI_PADDING_LEFT;
            relationItems.push({
                bgRect,
                icon,
                identifier,
                title,
                relationInfo
            });
        }
    }

    const offsetX = render.columnWidth - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
    const offsetY = (rowHeight - AI_TABLE_ACTION_COMMON_SIZE) / 2;

    const addActionConfig: Partial<AITableActionIconConfig> = {
        x: offsetX,
        y: offsetY,
        data: AddOutlinedPath,
        fill: Colors.gray600,
        coverFill: Colors.primary,
        backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
        backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
        cornerRadius: AI_TABLE_ACTION_COMMON_RADIUS,
        listening: true
    };

    const totalWidth = rowHeight + rowIndex * relationItemHeight - AI_TABLE_OFFSET * 2;

    return {
        relationItems,
        moreCount,
        addActionConfig,
        totalWidth
    };
}

function getNewRowWidth(columnWidth: number, currentX: number, showAddAction: boolean, maxRelationContainerWidth: number) {
    let remainingWidth = columnWidth - currentX - AI_TABLE_CELL_PADDING;
    // 需要 新增按钮时 减去 新增按钮的宽度
    if (showAddAction) {
        remainingWidth -= AI_TABLE_CELL_MULTI_PADDING_LEFT + AI_TABLE_ACTION_COMMON_SIZE + AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
    }

    let relationContainerWidth = Math.min(remainingWidth, maxRelationContainerWidth);
    return { relationContainerWidth, remainingWidth };
}
