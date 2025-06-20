import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject } from '../../angular-konva';
import { KoShape } from '../../angular-konva/components/shape.component';
import { Check, Colors, DEFAULT_ICON_SIZE, Unchecked } from '../../constants';
import { AITableActionIconConfig, AITableCheckType } from '../../types';
import { setMouseStyle } from '../../utils';

@Component({
    selector: 'ai-table-action-icon',
    template: `
        <ko-group
            [config]="groupConfig()"
            (koClick)="koClick($event)"
            (koMousemove)="koMousemove($event)"
            (koMouseenter)="koMouseenter($event)"
            (koMouseleave)="koMouseleave($event)"
        >
            <ko-rect [config]="squareShapeConfig()"></ko-rect>
            <ko-group [config]="iconGroupConfig()">
                <ko-path [config]="iconConfig()"></ko-path>
            </ko-group>
        </ko-group>
    `,
    imports: [KoContainer, KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableActionIcon {
    onClick = output<KoEventObject<MouseEvent>>();

    onMousemove = output<KoEventObject<MouseEvent>>();

    onMouseenter = output<KoEventObject<MouseEvent>>();

    onMouseleave = output<KoEventObject<MouseEvent>>();

    config = input.required<AITableActionIconConfig>();

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
            hoverFill: coverFill,
            size = DEFAULT_ICON_SIZE,
            strokeWidth = 1,
            cornerRadius,
            source
        } = this.config();
        return {
            name,
            width: backgroundWidth || size,
            height: backgroundHeight || size,
            strokeWidth: strokeWidth,
            fill: coverFill && this.isHover() ? coverFill : Colors.transparent,
            opacity: coverFill && this.isHover() ? 0.1 : 1,
            cornerRadius,
            source
        };
    });

    iconGroupConfig = computed(() => {
        let { backgroundWidth, backgroundHeight, size = DEFAULT_ICON_SIZE, scaleX, scaleY, offsetX, offsetY } = this.config();

        return {
            x: backgroundWidth && (backgroundWidth - size * (scaleX || 1)) / 2,
            y: backgroundHeight && (backgroundHeight - size * (scaleY || 1)) / 2,
            offsetX,
            offsetY,
            scaleX: scaleX || size / DEFAULT_ICON_SIZE,
            scaleY: scaleY || size / DEFAULT_ICON_SIZE
        };
    });

    iconConfig = computed(() => {
        let {
            type,
            data,
            size = DEFAULT_ICON_SIZE,
            stroke,
            strokeWidth = 1,
            scaleX,
            scaleY,
            offsetX,
            offsetY,
            rotation,
            fill,
            hoverFill: hoverFill,
            transformsEnabled = 'position'
        } = this.config();
        fill = fill || Colors.gray600;
        let pathData = data;

        switch (type) {
            case AITableCheckType.checked:
                pathData = Check;
                break;
            case AITableCheckType.unchecked:
                pathData = Unchecked;
                break;
        }

        return {
            data: pathData,
            width: size,
            height: size,
            fill: hoverFill && this.isHover() ? hoverFill : fill,
            offsetX,
            offsetY,
            scaleX,
            scaleY,
            rotation,
            stroke,
            strokeWidth,
            transformsEnabled,
            perfectDrawEnabled: false,
            listening: false
        };
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
        setMouseStyle('pointer', coordinate.container);
    }

    koMouseleave(e: KoEventObject<MouseEvent>) {
        this.onMouseleave.emit(e);
        this.isHover.set(false);
        const { coordinate } = this.config()!;
        setMouseStyle('default', coordinate.container);
    }
}
