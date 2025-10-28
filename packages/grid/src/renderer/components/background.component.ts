import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject, KoShapeConfigTypes } from '../../angular-konva';
import { KoShape } from '../../angular-konva/components/shape.component';
import { AI_TABLE_OFFSET, Colors } from '../../constants';
import { AITableBackgroundConfig } from '../../types';
import { setMouseStyle } from '../../utils';
import _ from 'lodash';

@Component({
    selector: 'ai-table-background',
    template: `
        <ko-group [config]="containerConfig()">
            <ko-group>
                <ko-rect
                    [config]="bgConfig()"
                    (koMousemove)="koMousemove($event)"
                    (koMouseenter)="onMouseenter($event)"
                    (koMouseleave)="onMouseleave($event)"
                    (koClick)="onClick($event)"
                ></ko-rect>
            </ko-group>
            <ko-group>
                @for (lineConfig of borderLinesConfig(); track $index) {
                    <ko-line [config]="lineConfig"></ko-line>
                }
            </ko-group>
        </ko-group>
    `,
    imports: [KoShape, KoContainer],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableBackground {
    config = input.required<AITableBackgroundConfig>();

    isActive = input<boolean>(false);

    koClick = output<KoEventObject<MouseEvent>>();

    hover = output<boolean>();

    koMouseenter = output<KoEventObject<MouseEvent>>();

    koMouseleave = output<KoEventObject<MouseEvent>>();

    groupConfig = computed<Partial<StageConfig>>(() => {
        const { x, y } = this.config();
        return { x, y, listening: false };
    });

    isHover = model<boolean>(false);

    isShowSpecialBorderConfig = computed(() => {
        const { borders } = this.config();
        const stroke = this.stroke();
        const strokeWidth = this.strokeWidth();
        return borders && stroke && strokeWidth && _.some(borders, (item) => !item) && _.some(borders, (item) => !!item);
    });

    borderLinesConfig = computed(() => {
        const { borders, height, width } = this.config();
        const stroke = this.stroke();
        const strokeWidth = this.strokeWidth();
        const result = [];
        const [top, right, bottom, left] = borders || [false, false, false, false];

        if (top) {
            result.push({
                x: 0,
                y: 0,
                points: [0, 0, width, 0],
                stroke,
                strokeWidth,
                listening: false
            });
        }

        if (right) {
            result.push({
                x: 0,
                y: 0,
                points: [width, 0, width, height],
                stroke,
                strokeWidth,
                listening: false
            });
        }

        if (bottom) {
            result.push({
                x: 0,
                y: 0,
                points: [0, height, width, height],
                stroke,
                strokeWidth,
                listening: false
            });
        }

        if (left) {
            result.push({
                x: 0,
                y: 0,
                points: [0, 0, 0, height],
                stroke,
                strokeWidth,
                listening: false
            });
        }

        return result;
    });
    stroke = computed(() => {
        const { stroke, hoverStroke } = this.config();
        const active = this.isHover() || this.isActive();
        return active ? hoverStroke || stroke : stroke;
    });
    strokeWidth = computed(() => {
        const { strokeWidth, hoverStrokeWidth } = this.config();
        const active = this.isHover() || this.isActive();
        return active ? hoverStrokeWidth || strokeWidth : strokeWidth;
    });

    containerConfig = computed(() => {
        const { x, y } = this.config();
        return { x, y };
    });

    bgConfig = computed(() => {
        const { name, width, height, fill = Colors.transparent, opacity, hoverFill, hoverOpacity, listening, borders } = this.config();
        const [top, right, bottom, left] = borders || [false, false, false, false];

        const active = this.isHover() || this.isActive();
        const strokeWidth = this.strokeWidth() || AI_TABLE_OFFSET;
        const result: KoShapeConfigTypes = {
            x: left ? 0 : strokeWidth,
            y: top ? 0 : strokeWidth,
            width: width - (left ? 0 : strokeWidth) - (right ? 0 : strokeWidth),
            height: height - (top ? 0 : strokeWidth) - (bottom ? 0 : strokeWidth),
            name,
            fill: active ? hoverFill || fill : fill,
            opacity: active ? hoverOpacity || opacity : opacity,
            listening
        };
        if (!this.isShowSpecialBorderConfig()) {
            result.stroke = this.stroke();
            result.strokeWidth = this.strokeWidth();
        }
        return result;
    });

    onClick(e: KoEventObject<MouseEvent>) {
        console.log('👊🏻👊🏻👊🏻 background koClick emit:', e);
        this.koClick.emit(e);
    }

    koMousemove(e: KoEventObject<MouseEvent>) {
        // e.event.cancelBubble = true;
    }

    onMouseenter(e: KoEventObject<MouseEvent>) {
        // console.log('👊🏻👊🏻👊🏻 background onMouseenter emit:', e);
        this.isHover.set(true);
        const { coordinate } = this.config()!;
        setMouseStyle('pointer', coordinate!.container);
        this.koMouseenter.emit(e);
        this.hover.emit(this.isHover()); // TODO
    }

    onMouseleave(e: KoEventObject<MouseEvent>) {
        // console.log('👊🏻👊🏻👊🏻 background onMouseleave emit:', e);
        this.isHover.set(false);
        const { coordinate } = this.config()!;
        setMouseStyle('default', coordinate!.container);
        this.koMouseleave.emit(e);
        this.hover.emit(this.isHover()); // TODO
    }
}
