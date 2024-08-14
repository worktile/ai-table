import {
    AIPlugin,
    AITable,
    AITableChangeOptions,
    AITableFieldMenuItem,
    AITableFields,
    AITableRecords,
    AITableReferences,
    buildGridData
} from '@ai-table/grid';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, model, output } from '@angular/core';
import { createGridView } from './create-view';

@Component({
    selector: 'konva-grid-view',
    template: `
        <div class="grid-view-container">
            <div class="vika-grid-view"></div>
        </div>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KonvaGridView implements AfterViewInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiReadonly = input<boolean>();

    aiPlugins = input<AIPlugin[]>();

    aiReferences = input<AITableReferences>();

    aiTable!: AITable;

    isSelectedAll = computed(() => {
        return this.aiTable.selection().selectedRecords.size === this.aiRecords().length;
    });

    onChange = output<AITableChangeOptions>();

    aiTableInitialized = output<AITable>();

    fieldMenus!: AITableFieldMenuItem[];

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields());
    });

    private elementRef = inject(ElementRef);

    ngAfterViewInit() {
        this.initView();
    }

    initView() {
        const gridStage = createGridView({
            aiTable: this.aiTable,
            fields: this.aiFields(),
            records: this.aiRecords(),
            container: this.elementRef.nativeElement.querySelector('.vika-grid-view'),
            width: this.elementRef.nativeElement.offsetWidth,
            height: this.elementRef.nativeElement.offsetHeight
        });
        gridStage.draw();
    }
}
