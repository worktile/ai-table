import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { KoShape } from '../../angular-konva';
import { ShapeConfig } from 'konva/lib/Shape';
import { AI_TABLE_SHADOW_DEFAULT_WIDTH, Colors } from '../../constants';
import { NodeConfig } from 'konva/lib/Node';

@Component({
    selector: 'ai-table-shadow',
    template: `<ko-rect [config]="shadowConfig()"></ko-rect>`,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableShadow {
    config = input.required<NodeConfig>();

    shadowConfig = computed<Partial<ShapeConfig>>(() => {
        const { visible, x, y, width = AI_TABLE_SHADOW_DEFAULT_WIDTH, height } = this.config();
        return {
            visible,
            x,
            y,
            width,
            height,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: width, y: 0 },
            fillLinearGradientColorStops: [0, 'rgba(0,0,0,0.05)', 1, Colors.transparent]
        };
    });
}
