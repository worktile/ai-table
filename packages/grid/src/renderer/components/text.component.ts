import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import Konva from 'konva';
import { KoShape } from '../../angular-konva/components/shape.component';
import {
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

@Component({
    selector: 'ai-table-text',
    template: ` <ko-text [config]="textConfig()" (koClick)="onClick($event)" (koMousemove)="onMousemove($event)"></ko-text> `,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableTextComponent {
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
            ...rest
        };
    });

    onClick(e: KoEventObject<MouseEvent>) {
        console.log('👊🏻👊🏻👊🏻 text koClick emit:', e);
        this.koClick.emit(e);
    }
    onMousemove(e: KoEventObject<MouseEvent>) {
        // console.log('👊🏻👊🏻👊🏻 text onMousemove emit:', e);
        this.koMouseMove.emit(e);
    }
}
