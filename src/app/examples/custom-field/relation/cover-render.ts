import { ChangeDetectionStrategy, Component, computed, effect, untracked } from '@angular/core';
import {
    KoShape,
    AI_TABLE_CELL,
    AI_TABLE_OFFSET,
    Colors,
    generateTargetName,
    AITableActionIconConfig,
    AITableActionIcon,
    drawer,
    aiTableTextConfigToKonvaConfig,
    AITableTextComponent,
    KoContainer,
    aiTableRectConfigToKonvaConfig,
    aiTableImageConfigToKonvaConfig,
    AI_TABLE_CELL_BORDER,
    ScrollableGroupConfig,
    AITableScrollableGroup,
    CoverCellBase,
    setExpandCellInfo,
    Drawer,
    AITableText,
    FONT_SIZE_SM,
    AddOutlinedPath,
    DEFAULT_FONT_WEIGHT,
    AI_TABLE_CELL_PADDING,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_ALIGN_LEFT,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_CELL_MULTI_PADDING_LEFT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AI_TABLE_CELL_MULTI_ITEM_MARGIN_LEFT,
    AITableRect,
    AITableRender
} from '@ai-table/grid';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import {
    TARGET_NAME_CELL_MORE_COUNT,
    TARGET_NAME_CELL_RELATION_DELETE,
    TARGET_NAME_CELL_RELATION_ADD,
    RelationOptionStyle,
    RelationKonvaConfig,
    RelationConfig,
    RelationFieldType,
    closeIconPath,
    RelationMoreCountInfo,
    AITableCustomReferences
} from './types';
import { hexToRgba } from './render';
import { AITableReferences } from '@ai-table/utils';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ai-table-relation',
    template: `
        <ko-group>
            @if (onlyDisplayBorder()) {
                @if (expandBorderConfig()) {
                    <ko-rect [config]="expandBorderConfig()!"></ko-rect>
                }
            } @else {
                <ko-group>
                    @if (expandContainer()) {
                        <ko-group>
                            <ko-rect [config]="expandContainer()!"></ko-rect>
                        </ko-group>
                        <ko-group #rootGroup>
                            <ai-table-scrollable-group
                                [config]="scrollConfig()"
                                [contentTemplate]="contentGroup"
                                [parentContainer]="rootGroup"
                            >
                                <ko-group #contentGroup>
                                    @for (relation of relations(); track relation.relationInfo._id) {
                                        <ko-group>
                                            <ko-rect [config]="relation.bgRect"></ko-rect>
                                        </ko-group>
                                        <ko-group>
                                            @if (relation.icon) {
                                                <ko-image [config]="relation.icon"></ko-image>
                                            }
                                            @if (relation.tag) {
                                                <ko-group>
                                                    <ko-rect [config]="relation.tag.bgRect"></ko-rect>
                                                </ko-group>
                                                <ko-group>
                                                    <ai-table-text [config]="relation.tag.text"></ai-table-text>
                                                </ko-group>
                                            }
                                            <ai-table-text [config]="relation.whole_identifier!"></ai-table-text>
                                            @if (relation.title) {
                                                <ai-table-text [config]="relation.title"></ai-table-text>
                                            }
                                            @if (relation.closeActionConfig) {
                                                <ai-table-action-icon [config]="relation.closeActionConfig!"></ai-table-action-icon>
                                            }
                                        </ko-group>
                                    }
                                </ko-group>
                            </ai-table-scrollable-group>
                        </ko-group>
                        <ko-group>
                            @if (addActionConfig()) {
                                <ai-table-action-icon [config]="addActionConfig()!"></ai-table-action-icon>
                            }
                        </ko-group>
                    } @else {
                        <ko-group>
                            @for (relation of relations(); track relation.relationInfo._id) {
                                <ko-group>
                                    <ko-group>
                                        <ko-rect [config]="relation.bgRect"></ko-rect>
                                    </ko-group>
                                    <ko-group>
                                        @if (relation.icon) {
                                            <ko-image [config]="relation.icon"></ko-image>
                                        }
                                        @if (relation.tag) {
                                            <ko-group>
                                                <ko-rect [config]="relation.tag.bgRect"></ko-rect>
                                            </ko-group>
                                            <ko-group>
                                                <ai-table-text [config]="relation.tag.text"></ai-table-text>
                                            </ko-group>
                                        }
                                        <ai-table-text [config]="relation.whole_identifier!"></ai-table-text>
                                        @if (relation.title) {
                                            <ai-table-text [config]="relation.title"></ai-table-text>
                                        }
                                        @if (relation.closeActionConfig) {
                                            <ai-table-action-icon [config]="relation.closeActionConfig"></ai-table-action-icon>
                                        }
                                    </ko-group>
                                </ko-group>
                            }

                            @if (moreCount()) {
                                <ko-group>
                                    <ko-rect [config]="moreCount()!.bgRect"></ko-rect>
                                </ko-group>
                                <ko-group>
                                    <ai-table-text [config]="moreCount()!.text"></ai-table-text>
                                </ko-group>
                            }

                            @if (addActionConfig()) {
                                <ai-table-action-icon [config]="addActionConfig()!"></ai-table-action-icon>
                            }
                        </ko-group>
                    }
                </ko-group>
            }
        </ko-group>
    `,
    imports: [CommonModule, KoShape, KoContainer, AITableActionIcon, AITableTextComponent, AITableScrollableGroup],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationCoverCell extends CoverCellBase {
    constructor() {
        super();
        effect(() => {
            const height = this.renderHeight();
            if (this.isExpand()) {
                untracked(() => {
                    const { render, aiTable } = this.config()!;
                    const { columnWidth } = render;
                    setExpandCellInfo(aiTable, { width: columnWidth, height });
                });
            }
        });
    }

    readonly renderHeight = computed(() => {
        const { totalHeight } = this.relationRenderConfig();
        return Math.min(totalHeight, 148);
    });

    readonly expandBorderConfig = computed(() => {
        const { render, isExpand } = this.config()!;
        const { columnWidth } = render;
        if (isExpand) {
            return {
                width: columnWidth - AI_TABLE_CELL_BORDER / 2,
                height: this.renderHeight(),
                stroke: Colors.primary,
                strokeWidth: 2,
                listening: false
            };
        }
        return null;
    });

    readonly expandContainer = computed(() => {
        const { render, field, recordId, isExpand } = this.config()!;
        const { columnWidth } = render;
        if (isExpand) {
            return {
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId,
                    mouseStyle: 'default'
                }),
                width: columnWidth,
                height: this.renderHeight(),
                fill: Colors.white,
                listening: true
            };
        }
        return null;
    });

    readonly scrollConfig = computed<ScrollableGroupConfig>(() => {
        const { render } = this.config()!;
        const { columnWidth } = render;
        const { totalHeight } = this.relationRenderConfig();

        return {
            width: columnWidth,
            height: this.renderHeight(),
            contentWidth: columnWidth,
            contentHeight: totalHeight,
            scrollbarSize: 9,
            scrollbarColor: Colors.gray700,
            x: 0,
            y: 0,
            listening: true,
            verticalScrollbar: true,
            horizontalScrollbar: true,
            contentNotScrollbar: false
        };
    });

    readonly relationRenderConfig = computed(() => {
        const { render, field, readonly, isExpand } = this.config()!;
        render.transformValue = render.transformValue || [];
        let headerType = RelationOptionStyle.icon;
        if (field.type === RelationFieldType.relationObjective) {
            headerType = RelationOptionStyle.tag;
        }
        const { relationItems, moreCount, addActionConfig, totalHeight } = getRelationItemsConfigs(
            {
                ...render,
                x: AI_TABLE_OFFSET,
                y: AI_TABLE_OFFSET
            },
            drawer,
            {
                showAddAction: !readonly,
                showClose: !readonly && isExpand,
                multilineRow: isExpand,
                headerType
            }
        );
        return {
            relationItems,
            moreCount,
            addActionConfig,
            totalHeight
        };
    });

    readonly moreCount = computed<{
        bgRect: RectConfig;
        text: TextConfig;
    } | null>(() => {
        const { render, aiTable, field, recordId, readonly } = this.config()!;
        const { rowHeight } = render;
        const moreCount = this.relationRenderConfig().moreCount;
        if (moreCount) {
            return {
                bgRect: aiTableRectConfigToKonvaConfig(moreCount.bgRect, {
                    name: generateTargetName({
                        targetName: AI_TABLE_CELL,
                        fieldId: field._id,
                        recordId,
                        source: TARGET_NAME_CELL_MORE_COUNT,
                        mouseStyle: 'pointer'
                    }),
                    listening: true
                }),
                text: aiTableTextConfigToKonvaConfig(moreCount.text, rowHeight)
            };
        }
        return null;
    });

    readonly relations = computed<RelationKonvaConfig[]>(() => {
        const { render, aiTable, field, recordId, readonly, coordinate } = this.config()!;
        const { rowHeight } = render;
        const { relationItems } = this.relationRenderConfig();
        if (relationItems?.length > 0) {
            const items = relationItems.map((relationItem: RelationConfig) => {
                const { relationInfo } = relationItem;
                const relationConfig: RelationKonvaConfig = {
                    bgRect: {
                        ...aiTableRectConfigToKonvaConfig(relationItem.bgRect!, {
                            name: generateTargetName({
                                targetName: AI_TABLE_CELL,
                                fieldId: field._id,
                                recordId,
                                mouseStyle: readonly ? 'default' : 'pointer',
                                source: relationInfo?._id
                            }),
                            listening: true
                        }),
                        relationInfo: relationInfo!
                    },
                    relationInfo: relationItem.relationInfo!
                };
                if (relationItem.whole_identifier) {
                    relationConfig.whole_identifier = aiTableTextConfigToKonvaConfig(relationItem.whole_identifier, rowHeight);
                }
                if (relationItem.title) {
                    relationConfig.title = aiTableTextConfigToKonvaConfig(relationItem.title, rowHeight);
                }

                if (relationItem.icon) {
                    relationConfig.icon = aiTableImageConfigToKonvaConfig(relationItem.icon, {
                        listening: false
                    });
                }
                if (relationItem?.tag) {
                    relationConfig.tag = {
                        bgRect: aiTableRectConfigToKonvaConfig(relationItem.tag.bgRect, {
                            name: generateTargetName({
                                targetName: AI_TABLE_CELL,
                                fieldId: field._id,
                                recordId,
                                source: TARGET_NAME_CELL_MORE_COUNT,
                                mouseStyle: 'pointer'
                            }),
                            listening: false
                        }),
                        text: aiTableTextConfigToKonvaConfig(relationItem.tag.text, rowHeight)
                    };
                }
                if (relationItem?.closeActionConfig && !readonly) {
                    relationConfig.closeActionConfig = {
                        ...relationItem?.closeActionConfig,
                        coordinate,
                        readonly,
                        listening: true,
                        name: generateTargetName({
                            targetName: AI_TABLE_CELL,
                            fieldId: field._id,
                            recordId,
                            source: TARGET_NAME_CELL_RELATION_DELETE,
                            mouseStyle: readonly ? 'default' : 'pointer'
                        }),
                        source: relationInfo
                    };
                }
                return relationConfig;
            });
            return items;
        }
        return [];
    });

    readonly addActionConfig = computed<AITableActionIconConfig | null>(() => {
        const { coordinate, field, recordId, readonly } = this.config()!;
        const { addActionConfig } = this.relationRenderConfig();
        if (!addActionConfig) {
            return null;
        }
        return {
            ...addActionConfig,
            coordinate,
            readonly,
            listening: true,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                source: TARGET_NAME_CELL_RELATION_ADD,
                mouseStyle: readonly ? 'default' : 'pointer'
            })
        };
    });
}

export function getRelationItemsConfigs(
    render: AITableRender<AITableReferences>,
    drawer: Drawer,
    options: {
        headerType: RelationOptionStyle;
        showAddAction: boolean;
        multilineRow: boolean;
        showClose: boolean;
    } = {
        headerType: RelationOptionStyle.icon,
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

            if (headerType === RelationOptionStyle.tag && field.type === RelationFieldType.relationObjective) {
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

            if (headerType === RelationOptionStyle.tag) {
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

            if (headerType === RelationOptionStyle.icon) {
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
