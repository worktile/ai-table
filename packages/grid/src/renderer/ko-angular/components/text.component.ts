import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import Konva from 'konva';
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
} from '../../../constants';
import { KoCoreShape } from './core-shape.component';

@Component({
    selector: 'ko-custom-text',
    template: ` <ko-text [config]="textConfig()"></ko-text> `,
    standalone: true,
    imports: [KoCoreShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoCustomText {
    config = input.required<Konva.ShapeConfig>();

    textConfig = computed(() => {
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
}
