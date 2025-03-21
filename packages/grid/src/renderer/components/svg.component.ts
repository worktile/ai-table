import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject } from '../../angular-konva';
import { KoShape } from '../../angular-konva/components/shape.component';
import { Check, Colors, DEFAULT_ICON_SIZE, Unchecked } from '../../constants';
import { AITableCheckType, AITableIconConfig, AITableSvgConfig } from '../../types';
import { setMouseStyle } from '../../utils';
import { idCreator } from '../../core';

@Component({
    selector: 'ai-table-svg',
    template: `
        <ko-group
            [config]="groupConfig()"
            (koClick)="koClick($event)"
            (koMousemove)="koMousemove($event)"
            (koMouseenter)="koMouseenter($event)"
            (koMouseleave)="koMouseleave($event)"
        >
            <ko-rect [config]="squareShapeConfig()"></ko-rect>
            @for (path of pathConfig(); track path._id) {
                <ko-path [config]="path"></ko-path>
            }
        </ko-group>
    `,
    standalone: true,
    imports: [KoContainer, KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableSvg {
    onClick = output<KoEventObject<MouseEvent>>();

    onMousemove = output<KoEventObject<MouseEvent>>();

    onMouseenter = output<KoEventObject<MouseEvent>>();

    onMouseleave = output<KoEventObject<MouseEvent>>();

    config = input.required<AITableSvgConfig>();

    isHover = signal(false);

    groupConfig = computed<Partial<StageConfig>>(() => {
        const { x, y, listening } = this.config();
        return { x, y, listening };
    });

    squareShapeConfig = computed(() => {
        const {
            name,
            backgroundWidth,
            backgroundHeight,
            size = DEFAULT_ICON_SIZE,
            strokeWidth = 1,
            background,
            cornerRadius,
            opacity,
            listening
        } = this.config();
        return {
            name,
            width: backgroundWidth || size,
            height: backgroundHeight || size,
            strokeWidth: strokeWidth,
            fill: background || Colors.transparent,
            cornerRadius,
            opacity,
            listening
        };
    });

    pathConfig = computed(() => {
        const { data, listening } = this.config();

        return (data || [])?.map((item: any) => {
            return {
                _id: idCreator(),
                data: item.d,
                opacity: item.opacity,
                fill: item.fill,
                stroke: item.stroke,
                strokeWidth: item.strokeWidth,
                listening
            };
        });
    });

    koClick(e: KoEventObject<MouseEvent>) {
        this.onClick.emit(e);
    }
    koMousemove(e: KoEventObject<MouseEvent>) {
        e.event.cancelBubble = true;
    }

    koMouseenter(e: KoEventObject<MouseEvent>) {
        this.onMouseenter.emit(e);
        this.isHover.set(true);
        const { coordinate } = this.config()!;
        console.log('============ coordinate =============');
        console.log(coordinate);
        setMouseStyle('pointer', coordinate.container);
    }

    koMouseleave(e: KoEventObject<MouseEvent>) {
        this.onMouseleave.emit(e);
        this.isHover.set(false);
        const { coordinate } = this.config()!;
        setMouseStyle('default', coordinate.container);
    }
}
