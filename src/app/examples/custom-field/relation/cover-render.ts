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
    setExpandCellInfo
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
    RelationFieldType
} from './types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ai-table-relation',
    template: `
        <!-- <ko-group>
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
        </ko-group> -->
    `,
    imports: [CommonModule, KoShape, KoContainer, AITableActionIcon, AITableTextComponent, AITableScrollableGroup],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationCoverCell extends CoverCellBase {
    constructor() {
        super();
        // effect(() => {
        //     const height = this.renderHeight();
        //     if (this.isExpand()) {
        //         untracked(() => {
        //             const { render, aiTable } = this.config()!;
        //             const { columnWidth } = render;
        //             setExpandCellInfo(aiTable, { width: columnWidth, height });
        //         });
        //     }
        // });
    }

    // readonly renderHeight = computed(() => {
    //     const { totalHeight } = this.relationRenderConfig();
    //     return Math.min(totalHeight, 148);
    // });

    // readonly expandBorderConfig = computed(() => {
    //     const { render, isExpand } = this.config()!;
    //     const { columnWidth } = render;
    //     if (isExpand) {
    //         return {
    //             width: columnWidth - AI_TABLE_CELL_BORDER / 2,
    //             height: this.renderHeight(),
    //             stroke: Colors.primary,
    //             strokeWidth: 2,
    //             listening: false
    //         };
    //     }
    //     return null;
    // });

    // readonly expandContainer = computed(() => {
    //     const { render, field, recordId, isExpand } = this.config()!;
    //     const { columnWidth } = render;
    //     if (isExpand) {
    //         return {
    //             name: generateTargetName({
    //                 targetName: AI_TABLE_CELL,
    //                 fieldId: field._id,
    //                 recordId,
    //                 mouseStyle: 'default'
    //             }),
    //             width: columnWidth,
    //             height: this.renderHeight(),
    //             fill: Colors.white,
    //             listening: true
    //         };
    //     }
    //     return null;
    // });

    // readonly scrollConfig = computed<ScrollableGroupConfig>(() => {
    //     const { render } = this.config()!;
    //     const { columnWidth } = render;
    //     const { totalHeight } = this.relationRenderConfig();

    //     return {
    //         width: columnWidth,
    //         height: this.renderHeight(),
    //         contentWidth: columnWidth,
    //         contentHeight: totalHeight,
    //         scrollbarSize: 9,
    //         scrollbarColor: Colors.gray700,
    //         x: 0,
    //         y: 0,
    //         listening: true,
    //         verticalScrollbar: true,
    //         horizontalScrollbar: true,
    //         contentNotScrollbar: false
    //     };
    // });

    // readonly relationRenderConfig = computed(() => {
    //     const { render, field, readonly, isExpand } = this.config()!;
    //     render.transformValue = render.transformValue || [];
    //     let headerType = RelationOptionStyle.icon;
    //     if (field.type === RelationFieldType.relationObjective) {
    //         headerType = RelationOptionStyle.tag;
    //     }
    //     const { relationItems, moreCount, addActionConfig, totalHeight } = getRelationItemsConfigs(
    //         {
    //             ...render,
    //             x: AI_TABLE_OFFSET,
    //             y: AI_TABLE_OFFSET
    //         },
    //         drawer,
    //         {
    //             showAddAction: !readonly,
    //             showClose: !readonly && isExpand,
    //             multilineRow: isExpand,
    //             headerType
    //         }
    //     );
    //     return {
    //         relationItems,
    //         moreCount,
    //         addActionConfig,
    //         totalHeight
    //     };
    // });

    // readonly moreCount = computed<{
    //     bgRect: RectConfig;
    //     text: TextConfig;
    // } | null>(() => {
    //     const { render, aiTable, field, recordId, readonly } = this.config()!;
    //     const { rowHeight } = render;
    //     const moreCount = this.relationRenderConfig().moreCount;
    //     if (moreCount) {
    //         return {
    //             bgRect: aiTableRectConfigToKonvaConfig(moreCount.bgRect, {
    //                 name: generateTargetName({
    //                     targetName: AI_TABLE_CELL,
    //                     fieldId: field._id,
    //                     recordId,
    //                     source: TARGET_NAME_CELL_MORE_COUNT,
    //                     mouseStyle: 'pointer'
    //                 }),
    //                 listening: true
    //             }),
    //             text: aiTableTextConfigToKonvaConfig(moreCount.text, rowHeight)
    //         };
    //     }
    //     return null;
    // });

    // readonly relations = computed<RelationKonvaConfig[]>(() => {
    //     const { render, aiTable, field, recordId, readonly, coordinate } = this.config()!;
    //     const { rowHeight } = render;
    //     const { relationItems } = this.relationRenderConfig();
    //     if (relationItems?.length > 0) {
    //         const items = relationItems.map((relationItem: RelationConfig) => {
    //             const { relationInfo } = relationItem;
    //             const relationConfig: RelationKonvaConfig = {
    //                 bgRect: {
    //                     ...aiTableRectConfigToKonvaConfig(relationItem.bgRect!, {
    //                         name: generateTargetName({
    //                             targetName: AI_TABLE_CELL,
    //                             fieldId: field._id,
    //                             recordId,
    //                             mouseStyle: readonly ? 'default' : 'pointer',
    //                             source: relationInfo?._id
    //                         }),
    //                         listening: true
    //                     }),
    //                     relationInfo: relationInfo!
    //                 },
    //                 relationInfo: relationItem.relationInfo!
    //             };
    //             if (relationItem.whole_identifier) {
    //                 relationConfig.whole_identifier = aiTableTextConfigToKonvaConfig(relationItem.whole_identifier, rowHeight);
    //             }
    //             if (relationItem.title) {
    //                 relationConfig.title = aiTableTextConfigToKonvaConfig(relationItem.title, rowHeight);
    //             }

    //             if (relationItem.icon) {
    //                 relationConfig.icon = aiTableImageConfigToKonvaConfig(relationItem.icon, {
    //                     listening: false
    //                 });
    //             }
    //             if (relationItem?.tag) {
    //                 relationConfig.tag = {
    //                     bgRect: aiTableRectConfigToKonvaConfig(relationItem.tag.bgRect, {
    //                         name: generateTargetName({
    //                             targetName: AI_TABLE_CELL,
    //                             fieldId: field._id,
    //                             recordId,
    //                             source: TARGET_NAME_CELL_MORE_COUNT,
    //                             mouseStyle: 'pointer'
    //                         }),
    //                         listening: false
    //                     }),
    //                     text: aiTableTextConfigToKonvaConfig(relationItem.tag.text, rowHeight)
    //                 };
    //             }
    //             if (relationItem?.closeActionConfig && !readonly) {
    //                 relationConfig.closeActionConfig = {
    //                     ...relationItem?.closeActionConfig,
    //                     coordinate,
    //                     readonly,
    //                     listening: true,
    //                     name: generateTargetName({
    //                         targetName: AI_TABLE_CELL,
    //                         fieldId: field._id,
    //                         recordId,
    //                         source: TARGET_NAME_CELL_RELATION_DELETE,
    //                         mouseStyle: readonly ? 'default' : 'pointer'
    //                     }),
    //                     source: relationInfo
    //                 };
    //             }
    //             return relationConfig;
    //         });
    //         return items;
    //     }
    //     return [];
    // });

    // readonly addActionConfig = computed<AITableActionIconConfig | null>(() => {
    //     const { coordinate, field, recordId, readonly } = this.config()!;
    //     const { addActionConfig } = this.relationRenderConfig();
    //     if (!addActionConfig) {
    //         return null;
    //     }
    //     return {
    //         ...addActionConfig,
    //         coordinate,
    //         readonly,
    //         listening: true,
    //         name: generateTargetName({
    //             targetName: AI_TABLE_CELL,
    //             fieldId: field._id,
    //             recordId,
    //             source: TARGET_NAME_CELL_RELATION_ADD,
    //             mouseStyle: readonly ? 'default' : 'pointer'
    //         })
    //     };
    // });
}
