import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoContainer, KoShape } from '../../angular-konva';
import { AITableCreateHeadsOptions } from '../../types';
import { createColumnHeads } from '../creations/create-heads';
import { AITableFieldHead } from './field-head.component';

@Component({
    selector: 'ai-table-column-heads',
    template: `
        @for (config of headConfigs(); track $index) {
            <ai-table-field-head [config]="config"></ai-table-field-head>
        }
    `,
    standalone: true,
    imports: [KoContainer, KoShape, AITableFieldHead],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableColumnHeads {
    options = input.required<AITableCreateHeadsOptions>();

    headConfigs = computed(() => {
        const { coordinate, columnStartIndex } = this.options();
        const { frozenColumnCount } = coordinate;
        return createColumnHeads({
            ...this.options(),
            columnStartIndex: Math.max(columnStartIndex, frozenColumnCount)
        });
    });
}
