import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, OnInit } from '@angular/core';
import { AITable, AITableFields, AITableRecords } from '../../core';
import { AITableGridContext, Context, createGridView } from '../../konva';

@Component({
    selector: 'grid-view',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100 grid-view-container'
    }
})
export class GridView implements OnInit {
    aiTable = input.required<AITable>();

    aiFields = model.required<AITableFields>();

    aiRecords = model.required<AITableRecords>();

    private elementRef = inject(ElementRef);

    constructor() {
        effect(() => {
            const AITable = this.aiTable();
            const fields = this.aiFields();
            const records = this.aiRecords();

            if (AITable || fields || records) {
                Context.updateState({
                    aiTable: this.aiTable(),
                    fields: this.aiFields(),
                    records: this.aiRecords()
                });
                this.drawView();
            }
        });
    }

    ngOnInit(): void {
        Context.updateState({
            aiTable: this.aiTable(),
            fields: this.aiFields(),
            records: this.aiRecords()
        });
    }

    drawView() {
        const context: AITableGridContext = {
            aiTable: this.aiTable(),
            fields: this.aiFields(),
            records: this.aiRecords()
        };
        const gridStage = createGridView({
            context,
            container: this.elementRef.nativeElement,
            width: this.elementRef.nativeElement.offsetWidth,
            height: this.elementRef.nativeElement.offsetHeight
        });
        gridStage.draw();
    }
}
