import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { KoShape } from '../../angular-konva';
import { ShapeConfig } from 'konva/lib/Shape';
import { AI_TABLE_FIELD_HEAD_HEIGHT, Colors } from '../../constants';
import { AITableFieldStatsConfig, AITableRendererConfig } from '../../types';

@Component({
    selector: 'ai-table-frozen-field-shadow',
    template: `<ko-line [config]="frozenShadowConfig()"></ko-line>`,
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
            x: this.frozenAreaWidth(),
            y: 0,
            points: [0, 0, 0, height],
            stroke: Colors.gray200,
            strokeWidth: 1,
            shadowColor: Colors.black,
            shadowBlur: 6,
            shadowOffset: { x: 3.5, y: 0 },
            shadowOpacity: 0.25,
            shadowForStrokeEnabled: true
        };
    });
}
