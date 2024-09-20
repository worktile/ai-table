import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import Konva from 'konva';
import { KoShape } from '../../angular-konva';
import { AITableCellsOptions } from '../../types';
import { createCells } from '../creations/create-cells';

@Component({
    selector: 'ai-table-frozen-cells',
    template: `<ko-shape [config]="frozenCellsConfig()"></ko-shape>`,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenCells {
    options = input.required<AITableCellsOptions>();

    frozenCellsConfig = computed(() => {
        const { coordinate } = this.options();
        const { frozenColumnCount } = coordinate;
        return {
            listening: false,
            perfectDrawEnabled: false,
            sceneFunc: (ctx: Konva.Context) =>
                createCells({
                    ...this.options(),
                    ctx,
                    columnStartIndex: 0,
                    columnStopIndex: frozenColumnCount - 1
                })
        };
    });
}
