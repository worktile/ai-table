import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
    KoShape,
    AI_TABLE_CELL,
    AI_TABLE_OFFSET,
    Colors,
    generateTargetName,
    AITableActionIconConfig,
    AITableActionIcon,
    CoverCellBase,
    drawer,
    aiTableTextConfigToKonvaConfig,
    AITableTextComponent,
    KoContainer,
    aiTableRectConfigToKonvaConfig,
    aiTableImageConfigToKonvaConfig,
    AI_TABLE_CELL_BORDER,
    AITableScrollableGroup,
    ScrollableGroupConfig,
    AI_TABLE_CELL_PADDING,
    DEFAULT_FONT_WEIGHT,
    AI_TABLE_ROW_BLANK_HEIGHT,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    DEFAULT_TEXT_DECORATION,
    AI_TABLE_TEXT_LINE_HEIGHT,
    AI_TABLE_COMMON_FONT_SIZE,
    AI_TABLE_CELL_LINE_BORDER
} from '@ai-table/grid';

import { AITableFieldType } from '@ai-table/utils';
import { AITableCustomFieldType, AITableRelationConfig, MoreCountItem, RelationItem } from '../../types/field';

@Component({
    selector: 'ai-table-relation',
    template: `
        <ko-group #rootGroup>
            @if (onlyDisplayBorder()) {
                @if (expandBorderConfig()) {
                    <ko-rect [config]="expandBorderConfig()!"></ko-rect>
                }
            } @else {
                <ko-group>
                    @if (expandContainer()) {
                        <ko-rect [config]="expandContainer()!"></ko-rect>
                        <ai-table-scrollable-group [config]="scrollConfig()" [contentTemplate]="contentGroup" [parentContainer]="rootGroup">
                            <ko-group #contentGroup>
                                <ko-text [config]="textConfig()"></ko-text>
                            </ko-group>
                        </ai-table-scrollable-group>
                    } @else if (cellTextConfig()) {
                        <ko-group>
                            <ai-table-text [config]="cellTextConfig()!"></ai-table-text>
                        </ko-group>
                    }
                </ko-group>
            }
        </ko-group>
    `,
    imports: [KoShape, KoContainer, AITableScrollableGroup, KoShape, AITableTextComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellRelationTicket extends CoverCellBase {
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

    override height = computed(() => {
        return this.maxHeight;
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
            contentWidth: columnWidth + 50, // 内容宽度大于容器宽度，会显示横向滚动条
            contentHeight: 260, // 内容高度大于容器高度，会显示竖向滚动条
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
        const { transformValue, x, y, rowHeight } = render;
        return {
            x,
            y:
                y +
                (rowHeight - AI_TABLE_COMMON_FONT_SIZE) / 2 -
                (AI_TABLE_COMMON_FONT_SIZE * (AI_TABLE_TEXT_LINE_HEIGHT - 1)) / 2 +
                AI_TABLE_CELL_LINE_BORDER,

            text: transformValue,
            wrap: 'none',
            fillStyle: Colors.gray800,
            fill: Colors.gray800,
            lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
            fontSize: AI_TABLE_COMMON_FONT_SIZE,
            listening: true,
            ellipsis: false
        };
    });

    containerGroupConfig = computed(() => {
        const { render, field, recordId, readonly, isExpand } = this.config()!;
        const { columnWidth, rowHeight } = render;
        return {
            width: columnWidth,
            height: rowHeight
        };
    });

    cellTextConfig = computed(() => {
        const { render, field, recordId, readonly, isExpand } = this.config()!;
        const { transformValue, columnWidth, rowHeight, x, y } = render;
        if (!transformValue) {
            return null;
        }

        const textMaxWidth = columnWidth - AI_TABLE_CELL_PADDING * 2;
        const { text } = drawer.textEllipsis({
            text: transformValue.replace(/\n/g, ' '),
            maxWidth: textMaxWidth,
            fontWeight: DEFAULT_FONT_WEIGHT,
            fontSize: AI_TABLE_COMMON_FONT_SIZE
        });

        const tmpTextConfig = {
            x,
            y: y + AI_TABLE_CELL_LINE_BORDER,
            text,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                mouseStyle: readonly ? 'default' : 'pointer'
            }),
            wrap: 'none',
            width: textMaxWidth,
            fillStyle: Colors.gray800,
            fill: Colors.gray800,
            height: rowHeight,
            lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
            fontSize: AI_TABLE_COMMON_FONT_SIZE,
            listening: true,
            ellipsis: true
        };

        return tmpTextConfig;
    });
}
