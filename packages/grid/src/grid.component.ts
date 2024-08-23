import { afterNextRender, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AITableGridBase } from './grid-base.component';
import { createGridStage } from './grid-renderer/create-grid-stage';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';

@Component({
    selector: 'ai-table-grid',
    template: '',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid d-block w-100 h-100'
    },
    imports: [],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit {
    constructor() {
        super();

        afterNextRender(() => {
            this.initGridRender();
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();
    }

    initGridRender() {
        const container = this.elementRef.nativeElement;
        const gridStage = createGridStage({
            aiTable: this.aiTable,
            container: container,
            width: container.offsetWidth,
            height: container.offsetHeight
        });
        gridStage.draw();
    }
}
