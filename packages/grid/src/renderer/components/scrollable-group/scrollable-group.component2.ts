import { ChangeDetectionStrategy, Component, computed, input, signal, effect, ViewChild, TemplateRef, output, inject } from '@angular/core';
import { KO_CONTAINER_TOKEN, KoContainer, KoEventObject } from '../../../angular-konva';
import { KoShape } from '../../../angular-konva/components/shape.component';
import { Colors } from '../../../constants';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';

@Component({
    selector: 'ai-table-scrollable-group2',
    template: ``,
    imports: [KoContainer, KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableScrollableGroup2 {
    private container = inject(KO_CONTAINER_TOKEN, { skipSelf: true });

    constructor() {
        console.log('============ container1111 =============');
        console.log(this.container);
    }
}
