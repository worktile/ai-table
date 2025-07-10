import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { KoShape } from '../../angular-konva';
import { ShapeConfig } from 'konva/lib/Shape';
import { AI_TABLE_FIELD_HEAD_HEIGHT, Colors } from '../../constants';
import { AITableFieldStatsConfig, AITableRendererConfig } from '../../types';

@Component({
    selector: 'ai-table-frozen-field-shadow',
    template: `<ko-rect [config]="frozenShadowConfig()"></ko-rect>`,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenFieldShadow {
    config = input.required<AITableRendererConfig | AITableFieldStatsConfig>();

    position = input<'table' | 'fieldStats'>('table');

    coordinate = computed(() => {
        return this.config().coordinate;
    });

    scrollState = computed(() => {
        return this.config().aiTable!.context!.scrollState();
    });

    frozenAreaWidth = computed(() => {
        return this.config().aiTable!.context!.rowHeadWidth() + this.config().coordinate!.frozenColumnWidth!;
    });

    frozenShadowConfig = computed<Partial<ShapeConfig>>(() => {
        const { aiTable } = this.config();
        const coordinate = this.coordinate();
        const rowCount = aiTable.gridData().records.length;
        const height =
            this.position() !== 'fieldStats'
                ? rowCount * coordinate.rowHeight + AI_TABLE_FIELD_HEAD_HEIGHT
                : (this.config() as AITableFieldStatsConfig).height;
        return {
            visible: this.scrollState().scrollLeft > 0,
            x: this.frozenAreaWidth() + 1, // 偏移1，避免和边框重叠导致颜色太深
            y: 0,
            width: 8,
            height,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: 8, y: 0 },
            fillLinearGradientColorStops: [0, 'rgba(0,0,0,0.05)', 1, Colors.transparent]
        };
    });
}
