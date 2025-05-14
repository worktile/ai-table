import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import Konva from 'konva';
import { KoShape } from '../../angular-konva/components/shape.component';
import {
    AI_TABLE_OFFSET,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_STYLE,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ELLIPSIS,
    DEFAULT_TEXT_FILL,
    DEFAULT_TEXT_LISTENING,
    DEFAULT_TEXT_TRANSFORMS_ENABLED,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    DEFAULT_TEXT_WRAP
} from '../../constants';
import { KoEventObject } from '../../angular-konva';
import { TextConfig } from 'konva/lib/shapes/Text';
import { Context } from 'konva/lib/Context';

@Component({
    selector: 'ai-table-text',
    template: ` <ko-text [config]="textConfig()" (koClick)="onClick($event)" (koMousemove)="onMousemove($event)"></ko-text> `,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableText {
    config = input.required<Konva.ShapeConfig>();

    // @Output() koClick = new EventEmitter<KoEventObject<MouseEvent>>();
    koClick = output<KoEventObject<MouseEvent>>();

    koMouseMove = output<KoEventObject<MouseEvent>>();

    textConfig = computed<TextConfig>(() => {
        const {
            x,
            y,
            width,
            height,
            text,
            padding,
            align = DEFAULT_TEXT_ALIGN_LEFT,
            verticalAlign = DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
            fill = DEFAULT_TEXT_FILL,
            textDecoration,
            fontSize = DEFAULT_FONT_SIZE,
            fontStyle = DEFAULT_FONT_STYLE,
            ellipsis = DEFAULT_TEXT_ELLIPSIS,
            wrap = DEFAULT_TEXT_WRAP,
            transformsEnabled = DEFAULT_TEXT_TRANSFORMS_ENABLED,
            listening = DEFAULT_TEXT_LISTENING,
            fontFamily = DEFAULT_FONT_FAMILY,
            ...rest
        } = this.config();
        const tmpText = new Konva.Text({
            text,
            fontSize,
            fontFamily
        });
        const textBounds = tmpText.getClientRect();
        return {
            x,
            y,
            width,
            height,
            text,
            padding,
            align,
            verticalAlign,
            fill,
            textDecoration,
            fontSize,
            fontStyle,
            ellipsis,
            wrap,
            transformsEnabled,
            listening,
            fontFamily,
            hitFunc: function (context: Context) {
                context.beginPath();
                context.rect(AI_TABLE_OFFSET, (height! - textBounds.height) / 2 - AI_TABLE_OFFSET, textBounds.width, textBounds.height);
                context.closePath();
                context.fillStrokeShape(this as any);
            },
            ...rest
        };
    });

    onClick(e: KoEventObject<MouseEvent>) {
        this.koClick.emit(e);
    }
    onMousemove(e: KoEventObject<MouseEvent>) {
        this.koMouseMove.emit(e);
    }
}
