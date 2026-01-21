import { ChangeDetectionStrategy, Component, computed, effect, untracked } from '@angular/core';
import {
    AI_TABLE_CELL,
    AI_TABLE_CELL_BORDER,
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_ROW_HEIGHT,
    AI_TABLE_TEXT_LINE_HEIGHT,
    Colors,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_STYLE,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ELLIPSIS,
    DEFAULT_TEXT_TRANSFORMS_ENABLED,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
} from '../../../constants';
import { generateTargetName, setExpandCellInfo } from '../../../utils';
import { AITableFieldType, isUndefinedOrNull } from '@ai-table/utils';
import { TextConfig } from 'konva/lib/shapes/Text';
import { AITableTextComponent } from '../text.component';
import { CoverCellBase } from './cover-cell-base';
import { KoShape, KoContainer } from '../../../angular-konva';
import Konva from 'konva';
import { AITableScrollableGroup, ScrollableGroupConfig } from '../scrollable-group';

@Component({
    selector: 'ai-table-single-text',
    template: `
        <ko-group>
            @if (isExpand()) {
                <ko-group>
                    <ko-group #rootGroup>
                        <ai-table-scrollable-group [config]="scrollConfig()" [contentTemplate]="contentGroup" [parentContainer]="rootGroup">
                            <ko-group #contentGroup>
                                <!-- <ai-table-text [config]="expandTextConfig()!"></ai-table-text> -->
                            </ko-group>
                        </ai-table-scrollable-group>
                    </ko-group>
                    <ko-group>
                        <ko-rect [config]="expandBorderConfig()!"></ko-rect>
                    </ko-group>
                </ko-group>
            } @else {
                @if (textConfig()) {
                    <ko-group>
                        <!-- <ai-table-text [config]="textConfig()!"></ai-table-text> -->
                    </ko-group>
                }
            }
        </ko-group>
    `,
    imports: [AITableTextComponent, KoShape, KoContainer, AITableScrollableGroup],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellText extends CoverCellBase {
    static override fieldType = AITableFieldType.text;

    cellName = computed(() => {
        const { field, recordId } = this.config()?.render!;
        return generateTargetName({
            targetName: AI_TABLE_CELL,
            fieldId: field._id,
            recordId
        });
    });

    constructor() {
        super();
        effect(() => {
            const height = this.height();
            if (this.isExpand()) {
                untracked(() => {
                    const { render, aiTable } = this.config()!;
                    const { columnWidth } = render;
                    setExpandCellInfo(aiTable, { width: columnWidth, height });
                });
            }
        });
    }

    expandBorderConfig = computed(() => {
        const { render, field, recordId, readonly, isExpand } = this.config()!;
        const { columnWidth } = render;
        if (isExpand) {
            return {
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId
                }),
                width: columnWidth - AI_TABLE_CELL_BORDER / 2,
                height: this.height(),
                stroke: Colors.primary,
                strokeWidth: 2,
                listening: false
            };
        }
        return null;
    });

    scrollConfig = computed<ScrollableGroupConfig>(() => {
        const { render, field, recordId, readonly, isExpand, coordinate } = this.config()!;
        const { columnWidth } = render;
        const { height } = this.expandTextBounds();

        return {
            width: columnWidth,
            height: this.height(),
            contentWidth: columnWidth, // 内容宽度大于容器宽度，会显示横向滚动条
            contentHeight: height, // 内容高度大于容器高度，会显示竖向滚动条
            scrollbarSize: 9,
            scrollbarColor: Colors.gray700,
            x: 0,
            y: 0,
            listening: true,
            verticalScrollbar: true,
            horizontalScrollbar: true,
            contentNotScrollbar: false,
            bgName: this.cellName()
        };
    });

    // 和这有关
    expandTextBounds = computed(() => {
        // const textRender = this.textString();
        // const tmpText = new Konva.Text({
        //     text: textRender,
        //     fontSize: DEFAULT_FONT_SIZE,
        //     fontFamily: DEFAULT_FONT_FAMILY,
        //     lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
        //     wrap: 'char',
        //     width: this.textMaxWidth(),
        //     align: DEFAULT_TEXT_ALIGN_LEFT,
        //     verticalAlign: 'top',
        //     fontStyle: DEFAULT_FONT_STYLE,
        //     ellipsis: DEFAULT_TEXT_ELLIPSIS,
        //     transformsEnabled: DEFAULT_TEXT_TRANSFORMS_ENABLED,
        //     listening: false
        // });
        // return {
        //     ...tmpText.getClientRect(),
        //     height: tmpText.getClientRect().height + this.startY() * 2 - AI_TABLE_CELL_LINE_BORDER
        // };

        return { x: 0, y: 0, width: 271.5, height: 1743.16 };
    });

    textMaxWidth = computed(() => {
        const { columnWidth } = this.config()?.render!;
        return columnWidth - AI_TABLE_CELL_PADDING - AI_TABLE_CELL_PADDING;
    });

    textString = computed(() => {
        const { transformValue } = this.config()?.render!;
        let textRender: string | undefined = transformValue;
        if (isUndefinedOrNull(textRender)) {
            return;
        }
        return textRender.replace(/\r|\n/g, ' ');
    });

    height = computed(() => {
        const { height } = this.expandTextBounds() || { height: 0 };
        return Math.min(Math.max(height, this.config()!.render.rowHeight - AI_TABLE_CELL_LINE_BORDER || AI_TABLE_ROW_BLANK_HEIGHT), 146);
    });

    startY = computed(() => {
        const { y, rowHeight } = this.config()?.render!;
        return (
            y +
            (AI_TABLE_ROW_HEIGHT - DEFAULT_FONT_SIZE) / 2 -
            (DEFAULT_FONT_SIZE * (AI_TABLE_TEXT_LINE_HEIGHT - 1)) / 2 +
            AI_TABLE_CELL_LINE_BORDER
        );
    });

    // 和这无关
    expandTextConfig = computed<TextConfig | undefined>(() => {
        // const render = this.config()?.render;
        // if (render) {
        //     const { x, y, transformValue, field, columnWidth, rowHeight, style, zIndex, recordId } = render;
        //     let textRender: string | undefined = this.textString();
        //     if (isUndefinedOrNull(textRender)) {
        //         return;
        //     }
        //     const { height } = this.expandTextBounds();

        //     return {
        //         x,
        //         y: this.startY(),
        //         name: this.cellName(),
        //         text: textRender,
        //         wrap: 'char',
        //         width: this.textMaxWidth(),
        //         fillStyle: Colors.primary,
        //         lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
        //         verticalAlign: 'top',
        //         height,
        //         listening: true,
        //         ellipsis: true,
        //         zIndex
        //     };
        // }
        // return;

        return {
            x: 14.5,
            y: 9.12,
            name: 'AI_TABLE_CELL.696851bfbfe04a082bb673e9.696f4f92b60834d6c4d4e5bc.$.$',
            text: '打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的',
            wrap: 'char',
            width: 271.5,
            fillStyle: '#6698FF',
            lineHeight: 1.84,
            verticalAlign: 'top',
            height: 1743.16,
            listening: true,
            ellipsis: true
        };
    });

    // 和这无关
    textConfig = computed<TextConfig | undefined>(() => {
        // const render = this.config()?.render;
        // if (render) {
        //     const { x, y, transformValue, field, columnWidth, rowHeight, style, zIndex } = render;
        //     let textRender: string | undefined = this.textString();
        //     if (isUndefinedOrNull(textRender)) {
        //         return;
        //     }

        //     return {
        //         x,
        //         y: this.startY(),
        //         verticalAlign: 'top',
        //         text: textRender,
        //         wrap: 'char',
        //         width: this.textMaxWidth(),
        //         fillStyle: Colors.primary,
        //         height: rowHeight + AI_TABLE_CELL_LINE_BORDER * 2,
        //         lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
        //         listening: false,
        //         ellipsis: true,
        //         zIndex
        //     };
        // }
        // return;

        return {
            x: 14.5,
            y: 9.12,
            verticalAlign: 'top',
            text: '打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的打开打卡当流动的',
            wrap: 'char',
            width: 271.5,
            fillStyle: '#6698FF',
            height: 46,
            lineHeight: 1.84,
            listening: false,
            ellipsis: true
        };
    });
}
