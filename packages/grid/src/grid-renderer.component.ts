import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, input, model, output } from '@angular/core';
import { AIPlugin, AITable, AITableChangeOptions, AITableFields, AITableRecords } from './core';
import { createGrid } from './render/create-grid';
import { AITableReferences } from './types';

@Component({
    selector: 'ai-table-grid-renderer',
    template: '',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid-renderer d-block w-100 h-100'
    }
})
export class AITableGridRenderer implements AfterViewInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiTable!: AITable;

    aiPlugins = input<AIPlugin[]>();

    aiReferences = input<AITableReferences>();

    private elementRef = inject(ElementRef);

    onChange = output<AITableChangeOptions>();

    aiTableInitialized = output<AITable>();

    ngAfterViewInit(): void {
        this.initGrid();
    }

    initGrid() {
        const container = this.elementRef.nativeElement;
        const gridStage = createGrid({
            aiTable: this.aiTable,
            fields: this.aiFields(),
            records: this.aiRecords(),
            container: container,
            width: container.offsetWidth,
            height: container.offsetHeight
        });
        gridStage.draw();
    }
}
