import { NgStyle } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { AITableEditorContainer } from './components';
import { DEFAULT_POINT_POSITION } from './constants';
import { AITable, AITableField, AITableRecord } from './core';
import { AITableGridBase } from './grid-base.component';
import { createGridStage } from './renderer/creations/create-grid-stage';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AITableContext, AITableEditPosition } from './types';
import { buildGridLinearRows, getRecordOrField } from './utils';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid d-block w-100 h-100'
    },
    imports: [NgStyle, AITableEditorContainer],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit {
    scrollState = signal({
        scrollTop: 0,
        scrollLeft: 0
    });

    cellScrollState = signal({
        scrollTop: 0,
        totalHeight: 0,
        isOverflow: false
    });

    activeCell = signal({
        recordId: 'row-1',
        fieldId: 'column-1'
    });

    activeCellBound = signal({ width: 0, height: 0 });

    pointPosition = signal(DEFAULT_POINT_POSITION);

    selectedField = signal<AITableField | null>(null);

    selectedRecord = signal<AITableRecord | null>(null);

    gridLinearRows = computed(() => {
        return buildGridLinearRows(this.aiRecords());
    });

    isCellActive = computed(() => {
        return this.aiTable.selection().selectedCells.size === 1;
    });

    context!: AITableContext;

    editPosition!: AITableEditPosition;

    constructor() {
        super();

        afterNextRender(() => {
            this.gridRender();
        });

        effect(() => {
            this.gridRender();
        });
    }

    gridRender() {
        const container = this.elementRef.nativeElement.querySelector('.vika-grid-view');
        this.context = {
            linearRows: this.gridLinearRows(),
            scrollState: this.scrollState,
            cellScrollState: this.cellScrollState,
            activeCellBound: this.activeCellBound,
            pointPosition: this.pointPosition,
            toggleEditing: (options) => {
                // this.aiTableGridEventService.openCanvasEdit(options);
                this.startEdit(options);
            }
        };
        const gridStage = createGridStage({
            aiTable: this.aiTable,
            context: this.context,
            container: container,
            width: container.offsetWidth,
            height: container.offsetHeight
        });
        gridStage.draw();
        console.log(gridStage.toObject());
    }

    startEdit(options: { aiTable: AITable; recordId: string; fieldId: string; position: AITableEditPosition }) {
        const { recordId, fieldId, position } = options;
        const field = getRecordOrField(this.aiTable.fields, fieldId) as Signal<AITableField>;
        const record = getRecordOrField(this.aiTable.records, recordId) as Signal<AITableRecord>;

        this.aiTableGridSelectionService.selectCell(recordId, fieldId);
        this.editPosition = position;
        this.selectedField.set(field());
        this.selectedRecord.set(record());
    }
}
