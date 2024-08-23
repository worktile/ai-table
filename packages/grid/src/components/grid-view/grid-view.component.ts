import { JsonPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    Renderer2
} from '@angular/core';
import { AITable, AITableFields, AITableRecords } from '../../core';
import { AI_TABLE_TO_ELEMENT_HOST, AILinearRow, createGridStage, getLinearRowsAndGroup } from '../../konva';
import { ContextStore } from '../../stores/context.store';

@Component({
    selector: 'grid-view',
    template: `
        <div class="w-100 h-100 vika-grid-view"></div>
        @if (dev && gridStageJson) {
            <div class="terminal">
                <pre>
                    <code>{{ gridStageJson | json }}</code>
                </pre>
            </div>
        }
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100 grid-view-container'
    },
    imports: [JsonPipe]
})
export class GridView implements OnInit {
    aiTable = input.required<AITable>();

    aiFields = model.required<AITableFields>();

    aiRecords = model.required<AITableRecords>();

    linearRows = computed<AILinearRow[]>(() => {
        return getLinearRowsAndGroup([], this.aiRecords()).linearRows;
    });

    contextStore!: ContextStore;

    dev = false;

    gridStageJson!: any;

    private elementRef = inject(ElementRef);

    private destroyRef = inject(DestroyRef);

    private render2 = inject(Renderer2);

    constructor() {
        effect(() => {
            const AITable = this.aiTable();
            const fields = this.aiFields();
            const records = this.aiRecords();
            if (AITable || fields || records) {
                this.drawView();
            }
        });
    }

    ngOnInit(): void {
        const container = this.elementRef.nativeElement.querySelector('.vika-grid-view');
        this.contextStore = new ContextStore({
            container,
            aiTable: this.aiTable(),
            fields: this.aiFields(),
            records: this.aiRecords(),
            linearRows: this.linearRows()
        });
        AI_TABLE_TO_ELEMENT_HOST.set(this.aiTable(), {
            container
        });
        this.registryChange();
        this.dev = localStorage.getItem('ai-table-dev') === 'true' ? true : false;
    }

    drawView() {
        const container = this.elementRef.nativeElement.querySelector('.vika-grid-view');
        this.contextStore.updateContextState({
            aiTable: this.aiTable(),
            fields: this.aiFields(),
            records: this.aiRecords(),
            linearRows: this.linearRows()
        });
        const storeValue = this.contextStore.getCurrentValue();
        const { context, instance, offsetX } = storeValue;

        const gridStage = createGridStage({
            container,
            context,
            instance,
            offsetX
        });
        gridStage.draw();
        this.gridStageJson = JSON.parse(gridStage.toJSON());
    }

    registryChange() {
        this.contextStore.pointPosition$?.asObservable().subscribe((pointPosition) => {
            this.drawView();
        });
    }
}
