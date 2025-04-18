import { Component, input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { KoShape } from '../../../angular-konva';
import { HoverCellComponent } from '../../interfaces';
import { AITableHoverCellConfig } from '../../../types';
import { AITableFieldType } from '../../../core';

@Component({
    selector: 'ai-table-progress',
    template: ``,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellProgress implements HoverCellComponent {
    static fieldType = AITableFieldType.progress;

    config = input<AITableHoverCellConfig>();
}
