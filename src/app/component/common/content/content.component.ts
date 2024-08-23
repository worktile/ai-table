import {
    Actions,
    AIFieldConfig,
    AIFieldPath,
    AIRecordPath,
    AITable,
    AITableChangeOptions,
    AITableDomGrid,
    AITableField,
    AITableGrid,
    AITableQueries,
    AITableRecord,
    DividerMenuItem,
    EditFieldPropertyItem,
    RemoveFieldItem
} from '@ai-table/grid';
import { AIViewTable, applyActionOps, withView, YjsAITable } from '@ai-table/shared';
import { ChangeDetectionStrategy, Component, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyLoading } from 'ngx-tethys/loading';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThySegment, ThySegmentEvent, ThySegmentItem } from 'ngx-tethys/segment';
import { withRemoveView } from '../../../plugins/view.plugin';
import { TABLE_SERVICE_MAP, TableService } from '../../../service/table.service';
import { getDefaultValue, getReferences } from '../../../utils/utils';
import { FieldPropertyEditor } from '../field-property-editor/field-property-editor.component';

@Component({
    selector: 'demo-table-content',
    standalone: true,
    imports: [
        RouterOutlet,
        ThyPopoverModule,
        FieldPropertyEditor,
        ThyAction,
        FormsModule,
        ThyInputDirective,
        ThySegment,
        ThySegmentItem,
        ThyLoading,
        AITableGrid,
        AITableDomGrid
    ],
    templateUrl: './content.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class DemoTableContent {
    aiTable!: AIViewTable;

    plugins = [withView, withRemoveView];

    aiFieldConfig: AIFieldConfig = {
        fieldPropertyEditor: FieldPropertyEditor,
        fieldMenus: [
            EditFieldPropertyItem,
            DividerMenuItem,
            {
                type: 'filterFields',
                name: '按本列筛选',
                icon: 'filter-line',
                exec: (aiTable: AITable, field: Signal<AITableField>) => {},
                hidden: (aiTable: AITable, field: Signal<AITableField>) => false,
                disabled: (aiTable: AITable, field: Signal<AITableField>) => false
            },
            DividerMenuItem,
            RemoveFieldItem
        ]
    };

    iconRegistry = inject(ThyIconRegistry);

    sanitizer = inject(DomSanitizer);

    tableService = inject(TableService);

    references = signal(getReferences());

    renderMode = signal(1);

    constructor() {
        this.registryIcon();
    }

    ngOnInit(): void {
        if (this.tableService.sharedType) {
            this.tableService.buildRenderRecords();
            this.tableService.buildRenderFields();
        } else {
            if (this.tableService.records && this.tableService.fields) {
                this.tableService.buildRenderRecords(this.tableService.records());
                this.tableService.buildRenderFields(this.tableService.fields());
            } else {
                const value = getDefaultValue();
                this.tableService.buildRenderRecords(value.records);
                this.tableService.buildRenderFields(value.fields);
            }
        }
        console.time('render');
    }

    ngAfterViewInit() {
        console.timeEnd('render');
    }

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }

    changeRenderMode(e: ThySegmentEvent) {
        this.renderMode.set(Number(e.value));
    }

    onChange(options: AITableChangeOptions) {
        if (this.tableService.sharedType) {
            if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                YjsAITable.asLocal(this.aiTable, () => {
                    applyActionOps(this.tableService.sharedType!, options.actions, this.aiTable);
                });
            }
        }
    }

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.views = this.tableService.views;
        this.aiTable.activeViewId = this.tableService.activeViewId;
        TABLE_SERVICE_MAP.set(this.aiTable, this.tableService);
        this.tableService.setAITable(this.aiTable);
    }

    removeRecord() {
        const recordIds = [...this.aiTable.selection().selectedRecords.keys()];
        recordIds.forEach((id) => {
            Actions.removeRecord(this.aiTable, [id]);
        });
    }

    moveField() {
        const newIndex = 2;
        const selectedFieldIds = [...this.aiTable.selection().selectedFields.keys()];
        const selectedFields = this.aiTable.fields().filter((item: AITableField) => selectedFieldIds.includes(item._id));
        selectedFields.forEach((item: AITableField) => {
            const path = AITableQueries.findFieldPath(this.aiTable, item) as AIFieldPath;
            Actions.moveField(this.aiTable, path, [newIndex]);
        });
    }

    moveRecord() {
        const selectedRecordIds = [...this.aiTable.selection().selectedRecords.keys()];
        const selectedRecords = this.aiTable.records().filter((item: AITableField) => selectedRecordIds.includes(item._id));
        const selectedRecordsAfterNewPath: AITableRecord[] = [];
        let offset = 0;
        const newIndex = 2;
        selectedRecords.forEach((item: AITableRecord) => {
            const path = AITableQueries.findRecordPath(this.aiTable, item) as AIRecordPath;
            if (path[0] < newIndex) {
                Actions.moveRecord(this.aiTable, path, [newIndex]);
                offset = 1;
            } else {
                selectedRecordsAfterNewPath.push(item);
            }
        });

        selectedRecordsAfterNewPath.reverse().forEach((item) => {
            const newPath = [newIndex + offset] as AIRecordPath;
            const path = AITableQueries.findRecordPath(this.aiTable, item) as AIRecordPath;
            Actions.moveRecord(this.aiTable, path, newPath);
        });
    }
}
