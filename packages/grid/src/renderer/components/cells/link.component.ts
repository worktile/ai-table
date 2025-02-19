import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoShape } from '../../../angular-konva/components/shape.component';
import { AI_TABLE_CELL_PADDING, AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE, AI_TABLE_FIELD_HEAD_MORE, Colors } from '../../../constants';
import { KoContainer } from '../../../angular-konva/components/container.component';
import { getMousePosition, getTextWidth, handleMouseStyle, TextMeasure } from '../../../utils';
import { AITableText } from '../text.component';
import { AITableHoverCellConfig, AITableRender } from '../../../types';
import { KoEventObject } from '../../../angular-konva';
import { AITable, AITableFieldType } from '../../../core';
import { TextConfig } from 'konva/lib/shapes/Text';
import { drawer } from '../../drawers/drawer';
import { HoverCellComponent } from '../../interfaces';

@Component({
    selector: 'ai-table-link',
    template: `
        @if (showLink()) {
            <ai-table-text [config]="textConfig()!" (koClick)="linkClick($event)" (koMouseMove)="linkMouseMove($event)"></ai-table-text>
        }
    `,
    standalone: true,
    imports: [KoContainer, KoShape, AITableText],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellLink implements HoverCellComponent {
    static fieldType = AITableFieldType.link;

    config = input<AITableHoverCellConfig | undefined>();

    textOffset = AI_TABLE_CELL_PADDING + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;

    render = computed<AITableRender | undefined>(() => this.config()?.render);

    transformValue = computed<{ text: string; url: string }>(() => this.render()?.transformValue);

    showLink = computed<boolean>(() => !!this.transformValue()?.text);

    textConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, y, transformValue, field, columnWidth, rowHeight, style, zIndex } = render;
            let textRender: string | null = transformValue.text;
            if (textRender == null) {
                return;
            }

            textRender = textRender.replace(/\r|\n/g, ' ');
            const fontWeight = style?.fontWeight;
            const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
            const { text, textWidth } = drawer.textEllipsis({
                text: textRender,
                maxWidth: textMaxWidth,
                fontWeight
            });

            return {
                x,
                y,
                text,
                wrap: 'none',
                width: textWidth,
                fillStyle: Colors.primary,
                fill: Colors.primary,
                height: rowHeight + 2,
                lineHeight: 1.84,
                listening: true,
                ellipsis: true,
                zIndex
            };
        }
        return;
    });

    linkClick(e: KoEventObject<MouseEvent>) {
        e.event.cancelBubble = true;
        window.open(this.transformValue().url, '_blank', 'noopener,noreferrer');
    }

    linkMouseMove(e: KoEventObject<MouseEvent>) {
        e.event.cancelBubble = true;
        const { aiTable, coordinate } = this.config()!;
        const targetName = e.event.target.name();
        const gridStage = e.event.currentTarget.getStage();
        const pos = gridStage?.getPointerPosition();
        if (pos == null) return;
        const { context } = aiTable;
        const { x, y } = pos;
        const curMousePosition = getMousePosition(x, y, coordinate, AITable.getVisibleFields(aiTable), context!, targetName);
        handleMouseStyle(AI_TABLE_FIELD_HEAD_MORE, curMousePosition.areaType, coordinate.container);
    }
}
