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
    DEFAULT_FONT_WEIGHT,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_LINE_HEIGHT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    DEFAULT_WRAP_TEXT_MAX_ROW
} from '../../../constants';
import { generateTargetName, setExpandCellInfo } from '../../../utils';
import { AITableFieldType, isUndefinedOrNull } from '@ai-table/utils';
import { TextConfig } from 'konva/lib/shapes/Text';
import { AITableTextComponent } from '../text.component';
import { CoverCellBase } from './cover-cell-base';
import { KoShape, KoContainer } from '../../../angular-konva';
import { AITableScrollableGroup, ScrollableGroupConfig } from '../scrollable-group';
import { drawer } from '../../drawers/drawer';

@Component({
    selector: 'ai-table-single-text',
    template: `
        <ko-group>
            @if (isExpand()) {
                <ko-group>
                    <ko-group #rootGroup>
                        <ai-table-scrollable-group [config]="scrollConfig()" [contentTemplate]="contentGroup" [parentContainer]="rootGroup">
                            <ko-group #contentGroup>
                                <ai-table-text [config]="expandTextConfig()!"></ai-table-text>
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
                        <ai-table-text [config]="textConfig()!"></ai-table-text>
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

    expandTextBounds = computed(() => {
        const textRender = this.textString();
        const render = this.config()?.render;
        if (!render) {
            return { height: 0, data: [] };
        }
        const { x, y } = render;

        const text = drawer.wrapTextWithKonva({
            x,
            y,
            text: textRender!,
            maxWidth: this.textMaxWidth(),
            fontSize: DEFAULT_FONT_SIZE,
            lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
            textAlign: DEFAULT_TEXT_ALIGN_LEFT,
            verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
            fillStyle: Colors.primary,
            fontWeight: DEFAULT_FONT_WEIGHT,
            textDecoration: DEFAULT_TEXT_DECORATION,
            fieldType: AITableFieldType.text,
            needDraw: false
        });
        return {
            ...text,
            height: text.height + AI_TABLE_CELL_PADDING + AI_TABLE_CELL_LINE_BORDER
        };

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

    expandTextConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, y, transformValue, field, columnWidth, rowHeight, style, zIndex, recordId } = render;
            let text: string | undefined = this.textString();
            if (isUndefinedOrNull(text)) {
                return;
            }
            const { height, data } = this.expandTextBounds();
            /**
             * Konva.Text 中的 wrap 为 none 时，则不进行换行计算处理
             * Konva.Text 中的 wrap 为 char/word/word-break,并且设置了 width参数时，则会进行计算  根据宽度计算容纳的内容，超过后进行换行
             * Konva.Text 中的 ellipsis 为 true，并且 wrap为char/word/word-break，设置了width 和 height 参数，则会计算超过的部分进行截断，展示...
             * 当 渲染的文字内容很多，开启上述运算时就会很耗时（实际是计算耗时，渲染并不耗时）。
             * 目前的优化方案：
             * 计算与渲染分离，优先计算出换行的结果并对数据进行缓存。
             * 渲染时，根据提前计算的结果，使用 \n 拼装计算出的所有行，直接进行渲染。
             */
            const textRender = data.map((item) => item.text).join('\n');
            return {
                x,
                y: this.startY(),
                name: this.cellName(),
                text: textRender,
                wrap: 'none',
                width: this.textMaxWidth(),
                fillStyle: Colors.primary,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                verticalAlign: 'top',
                height,
                listening: true,
                ellipsis: false,
                zIndex
            };

        }
        return;
    });

    textConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, y, transformValue, field, columnWidth, rowHeight, style, zIndex } = render;
            let textRender: string | undefined = this.textString();
            if (isUndefinedOrNull(textRender)) {
                return;
            }

            return {
                x,
                y: this.startY(),
                verticalAlign: 'top',
                text: textRender,
                wrap: 'char',
                width: this.textMaxWidth(),
                fillStyle: Colors.primary,
                height: rowHeight - AI_TABLE_CELL_PADDING,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                listening: false,
                ellipsis: true,
                zIndex
            };
        }
        return;
    });
}
