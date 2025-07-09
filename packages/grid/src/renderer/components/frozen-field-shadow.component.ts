import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { KoShape } from '../../angular-konva';
import { ShapeConfig } from 'konva/lib/Shape';
import { AI_TABLE_FIELD_HEAD_HEIGHT, AI_TABLE_FIELD_STAT_HEIGHT, Colors } from '../../constants';
import { AITableFieldStatsConfig, AITableRendererConfig } from '../../types';

@Component({
    selector: 'ai-table-frozen-field-shadow',
    template: ` <ko-line [config]="frozenShadowConfig()"></ko-line> `,
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
        const { aiTable, readonly } = this.config();
        const isStatContainerHover =
            this.position() === 'fieldStats' ? (this.config() as AITableFieldStatsConfig).isHoverStatContainer : false;
        const coordinate = this.coordinate();
        const visibleRowSize = aiTable.context!.visibleRowsIndexMap().size;
        const rowCount = readonly ? visibleRowSize : visibleRowSize - 1;
        const isScrolled = this.scrollState()!.scrollLeft > 0;
        const visible = this.position() !== 'fieldStats' ? isScrolled : isScrolled && isStatContainerHover;
        const height =
            this.position() !== 'fieldStats' ? rowCount * coordinate.rowHeight + AI_TABLE_FIELD_HEAD_HEIGHT : AI_TABLE_FIELD_STAT_HEIGHT;
        return {
            visible,
            x: this.frozenAreaWidth(),
            y: 0,
            points: [0, 0, 0, height],
            stroke: Colors.gray200,
            strokeWidth: 1,
            shadowColor: Colors.black,
            shadowBlur: 6,
            shadowOffset: { x: 3, y: 0 },
            shadowOpacity: 0.28,
            shadowForStrokeEnabled: true
        };
    });
}
