import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
    KoShape,
    AI_TABLE_CELL,
    AI_TABLE_OFFSET,
    Colors,
    generateTargetName,
    AITableActionIconConfig,
    AITableActionIcon,
    HoverCellComponent,
    drawer,
    aiTableTextConfigToKonvaConfig,
    AITableTextComponent,
    KoContainer,
    aiTableRectConfigToKonvaConfig,
    aiTableImageConfigToKonvaConfig,
    AI_TABLE_CELL_BORDER
} from '@ai-table/grid';

import { AITableFieldType } from '@ai-table/utils';
import { AITableCustomFieldType, AITableRelationConfig, MoreCountItem, RelationItem } from '../../types/field';
import { getRelationItemsConfigs } from './render';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { AI_TABLE_CELL_MORE_COUNT, RELATION_ADD_NAME_MAP } from '../../constants/field';

@Component({
    selector: 'ai-table-relation',
    template: `
        @if (onlyExpandBorder()) {
            @if (expandBorderConfig()) {
                <ko-rect [config]="expandBorderConfig()!"></ko-rect>
            }
        } @else {
            <ko-group>
                @if (expandContainer()) {
                    <ko-rect [config]="expandContainer()!"></ko-rect>
                }
            </ko-group>
            <ko-group>
                @for (relation of relations(); track relation.relationInfo._id) {
                    <ko-group>
                        <ko-group>
                            <ko-rect [config]="relation.bgRect"></ko-rect>
                        </ko-group>
                        <ko-group>
                            <ko-image [config]="relation.icon"></ko-image>
                            <ai-table-text [config]="relation.identifier"></ai-table-text>
                            @if (relation.title) {
                                <ai-table-text [config]="relation.title"></ai-table-text>
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

                <ai-table-action-icon [config]="addActionConfig()"></ai-table-action-icon>
            </ko-group>
        }
    `,
    imports: [KoShape, KoContainer, AITableActionIcon, AITableTextComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellRelationTicket extends HoverCellComponent {
    static override fieldType = AITableCustomFieldType.relationTicket;

    expandBorderConfig = computed(() => {
        const { render, field, recordId, readonly } = this.config()!;
        const { columnWidth } = render;
        if (this.isExpanded()) {
            const { totalWidth } = this.relationRenderConfig();
            return {
                width: columnWidth - AI_TABLE_CELL_BORDER / 2,
                height: totalWidth,
                stroke: Colors.primary,
                strokeWidth: 2,
                listening: false
            };
        }
        return null;
    });

    expandContainer = computed(() => {
        const { render, field, recordId, readonly } = this.config()!;
        const { columnWidth } = render;
        if (this.isExpanded()) {
            const { totalWidth } = this.relationRenderConfig();
            return {
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId,
                    mouseStyle: 'default'
                }),
                width: columnWidth,
                height: totalWidth,
                fill: Colors.white,
                listening: true
            };
        }
        return null;
    });

    isExpanded = computed(() => {
        const { aiTable } = this.config()!;
        return !!aiTable.selection().expandCell;
    });

    relationRenderConfig = computed(() => {
        const { render, aiTable, field, recordId, readonly } = this.config()!;
        render.transformValue = render.transformValue || [];
        const { relationItems, moreCount, addActionConfig, totalWidth } = getRelationItemsConfigs(
            {
                ...render,
                x: AI_TABLE_OFFSET,
                y: AI_TABLE_OFFSET
            },
            drawer,
            {
                showAddAction: true,
                multilineRow: this.isExpanded()
            }
        );
        return {
            relationItems,
            moreCount,
            addActionConfig,
            totalWidth
        };
    });

    moreCount = computed<{
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
                        source: AI_TABLE_CELL_MORE_COUNT,
                        mouseStyle: 'pointer'
                    }),
                    listening: true
                }),
                text: aiTableTextConfigToKonvaConfig(moreCount.text, rowHeight)
            };
        }
        return null;
    });

    relations = computed<AITableRelationConfig[]>(() => {
        const { render, aiTable, field, recordId, readonly } = this.config()!;
        const { rowHeight } = render;
        const { relationItems } = this.relationRenderConfig();
        if (relationItems?.length > 0) {
            const items = relationItems.map((relationItem: RelationItem) => {
                const relationItemConfig = relationItem as unknown as AITableRelationConfig;
                const { relationInfo } = relationItemConfig;
                const relationConfig: AITableRelationConfig = {
                    bgRect: aiTableRectConfigToKonvaConfig(relationItem.bgRect, {
                        name: generateTargetName({
                            targetName: AI_TABLE_CELL,
                            fieldId: field._id,
                            recordId,
                            mouseStyle: readonly ? 'default' : 'pointer',
                            source: relationInfo._id
                        }),
                        listening: true
                    }),
                    icon: aiTableImageConfigToKonvaConfig(relationItem.icon, {
                        listening: false
                    }),
                    identifier: aiTableTextConfigToKonvaConfig(relationItem.identifier, rowHeight),
                    title: aiTableTextConfigToKonvaConfig(relationItem.title, rowHeight),
                    relationInfo: relationItemConfig.relationInfo
                };
                return relationConfig;
            });
            return items;
        }
        return [];
    });

    addActionConfig = computed<AITableActionIconConfig>(() => {
        const { coordinate, field, recordId, readonly } = this.config()!;
        const { addActionConfig } = this.relationRenderConfig();

        return {
            ...addActionConfig,
            coordinate,
            readonly,
            listening: true,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                source: RELATION_ADD_NAME_MAP[field.type as AITableCustomFieldType],
                mouseStyle: readonly ? 'default' : 'pointer'
            })
        };
    });
}
