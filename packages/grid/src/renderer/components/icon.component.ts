import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer } from '../../angular-konva';
import { KoShape } from '../../angular-konva/components/shape.component';
import { Check, Colors, DEFAULT_ICON_SIZE, Unchecked } from '../../constants';
import { AITableCheckType, AITableIconConfig } from '../../types';

@Component({
    selector: 'ai-table-icon',
    template: `
        <ko-group [config]="groupConfig()">
            <ko-rect [config]="squareShapeConfig()"></ko-rect>
            <ko-path [config]="iconConfig()"></ko-path>
        </ko-group>
    `,
    standalone: true,
    imports: [KoContainer, KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableIcon {
    config = input.required<AITableIconConfig>();

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
            opacity
        } = this.config();
        return {
            name,
            width: backgroundWidth || size,
            height: backgroundHeight || size,
            strokeWidth: strokeWidth,
            fill: background || Colors.transparent,
            cornerRadius,
            opacity
        };
    });

    iconConfig = computed(() => {
        const {
            type,
            data,
            backgroundWidth,
            backgroundHeight,
            size = DEFAULT_ICON_SIZE,
            stroke,
            strokeWidth = 1,
            scaleX,
            scaleY,
            offsetX,
            offsetY,
            rotation,
            fill = Colors.gray600,
            transformsEnabled = 'position'
        } = this.config();

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
            x: backgroundWidth && (backgroundWidth - size * (scaleX || 1)) / 2,
            y: backgroundHeight && (backgroundHeight - size * (scaleY || 1)) / 2,
            data: pathData,
            width: size,
            height: size,
            fill,
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
}
