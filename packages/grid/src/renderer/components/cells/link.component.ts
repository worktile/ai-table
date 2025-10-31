import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_TEXT_LINE_HEIGHT,
    Colors,
    DEFAULT_FONT_SIZE
} from '../../../constants';
import { AITable, getMousePosition, handleMouseStyle } from '../../../utils';
import { AITableTextComponent } from '../text.component';
import { AITableRender } from '../../../types';
import { KoEventObject } from '../../../angular-konva';
import { AITableFieldType } from '@ai-table/utils';
import { TextConfig } from 'konva/lib/shapes/Text';
import { drawer } from '../../drawers/drawer';
import { CoverCellBase } from './cover-cell-base';

@Component({
    selector: 'ai-table-link',
    template: `
        @if (showLink()) {
            <ai-table-text [config]="textConfig()!" (koClick)="linkClick($event)" (koMouseMove)="linkMouseMove($event)"></ai-table-text>
        }
    `,
    imports: [AITableTextComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellLink extends CoverCellBase {
    static override fieldType = AITableFieldType.link;

    textOffset = AI_TABLE_CELL_PADDING + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;

    render = computed<AITableRender | undefined>(() => this.config()?.render);

    transformValue = computed<{ text: string; url: string }>(() => this.render()?.transformValue);

    showLink = computed<boolean>(() => !!this.transformValue()?.text);

    textConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, y, transformValue, columnWidth, rowHeight, style, zIndex } = render;
            let textRender: string | null = transformValue.text;
            if (textRender == null) {
                return;
            }

            textRender = textRender.replace(/\r|\n/g, ' ');
            const fontWeight = style?.fontWeight;
            const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
            const { textWidth } = drawer.textEllipsis({
                text: textRender,
                maxWidth: textMaxWidth,
                fontWeight
            });
            return {
                x,
                y: (44 - DEFAULT_FONT_SIZE * AI_TABLE_TEXT_LINE_HEIGHT) / 2,
                text: textRender,
                wrap: 'char',
                width: textWidth,
                verticalAlign: 'top',
                height: rowHeight,
                fillStyle: Colors.primary,
                fill: Colors.primary,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                listening: true,
                ellipsis: true,
                textDecoration: 'underline',
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
        const curMousePosition = getMousePosition(aiTable, x, y, coordinate, AITable.getVisibleFields(aiTable), context!, targetName);
        handleMouseStyle(AI_TABLE_FIELD_HEAD_MORE, curMousePosition.areaType, coordinate.container);
    }
}
