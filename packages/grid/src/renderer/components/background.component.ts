import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, model, output, signal } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoEventObject } from '../../angular-konva';
import { KoShape } from '../../angular-konva/components/shape.component';
import { Colors } from '../../constants';
import { AITableBackgroundConfig } from '../../types';
import { setMouseStyle } from '../../utils';

@Component({
    selector: 'ai-table-background',
    template: `
        <ko-rect
            [config]="squareShapeConfig()"
            (koMousemove)="koMousemove($event)"
            (koMouseenter)="onMouseenter($event)"
            (koMouseleave)="onMouseleave($event)"
            (koClick)="koClick.emit($event)"
        ></ko-rect>
    `,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableBackground {
    config = input.required<AITableBackgroundConfig>();

    isActive = input<boolean>(false);

    koClick = output<KoEventObject<MouseEvent>>();

    koMouseenter = output<KoEventObject<MouseEvent>>();

    koMouseleave = output<KoEventObject<MouseEvent>>();

    groupConfig = computed<Partial<StageConfig>>(() => {
        const { x, y } = this.config();
        return { x, y, listening: false };
    });

    isHover = model<boolean>(false);

    squareShapeConfig = computed(() => {
        const {
            x,
            y,
            name,
            width,
            height,
            strokeWidth = 1,
            fill = Colors.transparent,
            cornerRadius,
            opacity,
            stroke,
            hoverFill,
            hoverStroke,
            hoverStrokeWidth,
            hoverOpacity,
            listening
        } = this.config();
        const active = this.isHover() || this.isActive();
        return {
            x,
            y,
            name,
            width,
            height,
            fill: active ? hoverFill || fill : fill,
            cornerRadius,
            stroke: active ? hoverStroke || stroke : stroke,
            strokeWidth: active ? hoverStrokeWidth || strokeWidth : strokeWidth,
            opacity: active ? hoverOpacity || opacity : opacity,
            listening
        };
    });

    onClick(e: KoEventObject<MouseEvent>) {
        this.koClick.emit(e);
    }

    koMousemove(e: KoEventObject<MouseEvent>) {
        // e.event.cancelBubble = true;
    }

    onMouseenter(e: KoEventObject<MouseEvent>) {
        this.isHover.set(true);
        const { coordinate } = this.config()!;
        setMouseStyle('pointer', coordinate.container);
        this.koMouseenter.emit(e);
    }

    onMouseleave(e: KoEventObject<MouseEvent>) {
        this.isHover.set(false);
        const { coordinate } = this.config()!;
        setMouseStyle('default', coordinate.container);
        this.koMouseleave.emit(e);
    }
}
