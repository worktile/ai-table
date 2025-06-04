import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
    KoShape,
    AddOutlinedPath,
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL,
    AI_TABLE_CELL_ATTACHMENT_ADD,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ITEM_MARGIN_RIGHT,
    AI_TABLE_FILE_ICON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_BLANK_HEIGHT,
    Colors,
    generateTargetName,
    getFileThumbnailSvgString,
    AITableActionIconConfig,
    AITableAttachmentConfig,
    AITableHoverCellConfig,
    AITableActionIcon,
    HoverCellComponent,
    drawer,
    transformTextCanvasToKonva,
    AITableTextComponent,
    KoContainer,
    transformRectCanvasToKonva,
    transformImageCanvasToKonva
} from '@ai-table/grid';

import { AITableFieldType } from '@ai-table/utils';
import { AITableCustomFieldType, AITableRelationConfig, MoreCountItem, RelationItem } from '../../types/field';
import { getRelationItemsConfigs } from './render';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { RELATION_ADD_NAME_MAP } from '../../constants/field';

@Component({
    selector: 'ai-table-relation',
    template: `
        @for (relation of relations(); track relation.relationInfo._id) {
            <ko-group>
                <ko-group>
                    <ko-rect [config]="relation.bgRect"></ko-rect>
                </ko-group>
                <ko-group>
                    <ko-image [config]="relation.icon"></ko-image>
                    <ai-table-text [config]="relation.identifier"></ai-table-text>
                    <ai-table-text [config]="relation.title"></ai-table-text>
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
    `,
    imports: [KoShape, KoContainer, AITableActionIcon, AITableTextComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellRelationTicket implements HoverCellComponent {
    static fieldType = AITableCustomFieldType.relationTicket;

    config = input<AITableHoverCellConfig>();

    relationRenderConfig = computed(() => {
        const { render, aiTable, field, recordId, readonly } = this.config()!;
        render.transformValue = render.transformValue || [];
        const { relationItems, moreCount, addActionConfig } = getRelationItemsConfigs(
            {
                ...render,
                x: AI_TABLE_OFFSET,
                y: AI_TABLE_OFFSET
            },
            drawer,
            {
                showAddAction: true
            }
        );
        return {
            relationItems,
            moreCount,
            addActionConfig
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
                bgRect: transformRectCanvasToKonva(moreCount.bgRect, {
                    name: generateTargetName({
                        targetName: AI_TABLE_CELL,
                        fieldId: field._id,
                        recordId,
                        mouseStyle: readonly ? 'default' : 'pointer'
                    }),
                    listening: true
                }),
                text: transformTextCanvasToKonva(moreCount.text, rowHeight)
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
                    bgRect: transformRectCanvasToKonva(relationItem.bgRect, {
                        name: generateTargetName({
                            targetName: AI_TABLE_CELL,
                            fieldId: field._id,
                            recordId,
                            mouseStyle: readonly ? 'default' : 'pointer',
                            source: relationInfo._id
                        }),
                        listening: true
                    }),
                    icon: transformImageCanvasToKonva(relationItem.icon, {
                        listening: false
                    }),
                    identifier: transformTextCanvasToKonva(relationItem.identifier, rowHeight),
                    title: transformTextCanvasToKonva(relationItem.title, rowHeight),
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
