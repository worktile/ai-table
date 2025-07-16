import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
    KoShape,
    AI_TABLE_CELL,
    Colors,
    generateTargetName,
    BaseCoverCell,
    KoContainer,
    AI_TABLE_CELL_BORDER,
    AITableScrollableGroup,
    ScrollableGroupConfig
} from '@ai-table/grid';

import { AITableCustomFieldType } from '../../types/field';

@Component({
    selector: 'ai-table-relation',
    template: `
        <ko-group>
            @if (onlyDisplayBorder()) {
                @if (expandBorderConfig()) {
                    <ko-rect [config]="expandBorderConfig()!"></ko-rect>
                }
            } @else {
                <ko-group #rootGroup>
                    @if (expandContainer()) {
                        <ko-rect [config]="expandContainer()!"></ko-rect>
                        <ai-table-scrollable-group [config]="scrollConfig()" [contentTemplate]="contentGroup" [parentContainer]="rootGroup">
                            <ko-group #contentGroup>
                                <ko-text [config]="textConfig()"></ko-text>
                            </ko-group>
                        </ai-table-scrollable-group>
                    }
                </ko-group>
            }
        </ko-group>
    `,
    imports: [KoShape, KoContainer, AITableScrollableGroup, KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellRelationTicket extends BaseCoverCell {
    static override fieldType = AITableCustomFieldType.customDemo;

    maxHeight = 200;

    expandBorderConfig = computed(() => {
        const { render, field, recordId, readonly, isExpand } = this.config()!;
        const { columnWidth } = render;
        if (isExpand) {
            return {
                width: columnWidth - AI_TABLE_CELL_BORDER / 2,
                height: this.maxHeight,
                stroke: Colors.primary,
                strokeWidth: 2,
                listening: false
            };
        }
        return null;
    });

    expandContainer = computed(() => {
        const { render, field, recordId, readonly, isExpand } = this.config()!;
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
                height: this.maxHeight,
                fill: Colors.white,
                listening: true
            };
        }
        return null;
    });

    scrollConfig = computed<ScrollableGroupConfig>(() => {
        const { render, field, recordId, readonly, isExpand, coordinate } = this.config()!;
        const { columnWidth } = render;
        return {
            width: columnWidth,
            height: this.maxHeight,
            contentWidth: columnWidth, // 内容宽度大于容器宽度，会显示横向滚动条
            contentHeight: 500, // 内容高度大于容器高度，会显示竖向滚动条
            scrollbarSize: 10,
            scrollbarColor: Colors.gray700,
            x: 0,
            y: 0,
            listening: true,
            verticalScrollbar: true,
            horizontalScrollbar: true,
            contentNotScrollbar: false
        };
    });

    textConfig = computed(() => {
        const { render, field, recordId, readonly, isExpand } = this.config()!;
        const transformValue = render.transformValue;
        return {
            x: 20,
            y: 20,
            text: transformValue,
            fontSize: 16,
            fill: '#333333',
            width: 760
        };
    });
}
