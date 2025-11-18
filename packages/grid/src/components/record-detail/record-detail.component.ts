import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
    viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { ThySlideRef } from 'ngx-tethys/slide';
import { AITable, AITableQueries, createDefaultField } from '../../core';
import {
    AITableField,
    AITableFieldType,
    AITableReferences,
    UpdateFieldValueOptions,
    SelectSettings,
    AIRecordFieldIdPath
} from '@ai-table/utils';
import { AITableFieldMenu } from '../field-menu/field-menu.component';
import { DynamicCellEditorComponent } from './dynamic-cell-editor.component';
import { AITableFieldSetting } from '../field-setting/field-setting.component';
import { ThyDivider } from 'ngx-tethys/divider';
import { ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';
import { ComponentTypeOrTemplateRef } from 'ngx-tethys/core';
import {
    AITableActions,
    clearSelection,
    closeExpendCell,
    getRecordNavigationInfo,
    getNextRecordByActiveCell,
    getPreviousRecordByActiveCell,
    selectCells,
    setActiveCell
} from '../../utils';
import { AITableGridCellRenderSchema } from '../../types';

@Component({
    selector: 'ai-record-detail',
    standalone: true,
    imports: [
        CommonModule,
        ScrollingModule,
        ThyButtonModule,
        ThyIconModule,
        ThyDivider,
        ThyPopoverModule,
        ThyDropdownMenuItemDirective,
        DynamicCellEditorComponent
    ],
    templateUrl: './record-detail.component.html',
    styleUrls: ['./record-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit {
    readonly aiTable = input.required<AITable>();
    readonly recordId = input.required<string>();
    readonly references = input.required<AITableReferences>();

    readonly actions = input<AITableActions>();

    // 自定义cell编辑组件
    readonly customCellEditors = input<Record<AITableFieldType | string, AITableGridCellRenderSchema>>();

    // 自定义更多菜单模板
    readonly headerMoreMenuTemplate = input<TemplateRef<any>>();

    // 自定义字段操作模板
    readonly fieldOperationsTemplate = input<TemplateRef<any>>();

    readonly recordIdChange = output<string>();

    private internalRecordId = signal<string>('');

    currentRecordId = computed(() => {
        const inputId = this.recordId();
        const internalId = this.internalRecordId();
        return internalId || inputId;
    });

    readonly fieldOperationsMenuTemp = viewChild<TemplateRef<any>>('fieldOperationsMenuTemp');

    private slideRef = inject(ThySlideRef);
    private thyPopover = inject(ThyPopover);

    record = computed(() => {
        return this.aiTable().recordsMap()[this.currentRecordId()];
    });

    fields = computed(() => {
        return this.aiTable().gridData().fields;
    });

    firstField = computed(() => {
        return this.aiTable().gridData().fields[0];
    });

    lastField = computed(() => {
        const fields = this.aiTable().gridData().fields;
        return fields[fields.length - 1];
    });

    recordTitle = computed(() => {
        const firstField = this.firstField();
        if (!firstField) return '未命名记录';

        const cellValue = AITableQueries.getFieldValue(this.aiTable(), [this.currentRecordId(), firstField._id]);
        return this.formatCellValue(cellValue, firstField) || '未命名记录';
    });

    recordPosition = computed(() => {
        return getRecordNavigationInfo(this.aiTable(), this.currentRecordId());
    });

    fieldMenus = computed(() => {
        const fieldMenusFn = this.aiTable()?.context?.aiFieldConfig()?.fieldMenus;
        if (fieldMenusFn && this.aiTable()) {
            return fieldMenusFn(this.aiTable(), 'record-detail');
        }
        return [];
    });

    activeFieldId: string | null = null;

    fieldMenuVisible: Record<string, boolean> = {};

    constructor() {
        effect(() => {
            const activeCell = this.aiTable().selection().activeCell;
            if (activeCell) {
                this.internalRecordId.set(activeCell[0]);
            }
        });
    }

    ngOnInit(): void {
        this.setSelection(this.recordId());
        this.internalRecordId.set(this.recordId());
    }

    close(): void {
        this.slideRef?.close();
    }

    previousRecord(): void {
        const prevId = getPreviousRecordByActiveCell(this.aiTable());
        if (prevId) {
            this.internalRecordId.set(prevId);
            this.setSelection(prevId);
        }
    }

    nextRecord(): void {
        const nextId = getNextRecordByActiveCell(this.aiTable());
        if (nextId) {
            this.internalRecordId.set(nextId);
            this.setSelection(nextId);
        }
    }

    deleteRecord(): void {
        this.actions()?.removeRecord?.([this.currentRecordId()]);
        this.close();
    }

    onFieldClick(fieldId: string): void {
        this.activateField(fieldId);

        setActiveCell(this.aiTable(), [this.currentRecordId(), fieldId]);
    }

    showFieldMenu(fieldId: string): void {
        this.fieldMenuVisible[fieldId] = true;
    }

    hideFieldMenu(fieldId: string): void {
        this.fieldMenuVisible[fieldId] = false;
    }

    fieldMenuMoreClick(e: MouseEvent, fieldId: string) {
        const origin = e.target as HTMLElement;
        const position = origin.getBoundingClientRect();
        this.thyPopover.open(
            this.fieldOperationsTemplate() ? (this.fieldOperationsMenuTemp() as ComponentTypeOrTemplateRef<any>) : AITableFieldMenu,
            {
                origin,
                placement: 'bottomRight',
                manualClosure: true,
                initialState: {
                    aiTable: this.aiTable(),
                    fieldId,
                    fieldMenus: this.fieldMenus(),
                    origin,
                    position
                }
            }
        );
    }

    addNewField(e: MouseEvent): void {
        const origin = e.target as HTMLElement;
        const newField = createDefaultField(this.aiTable(), AITableFieldType.text);
        const popoverRef = this.thyPopover.open(AITableFieldSetting, {
            origin,
            placement: 'topLeft',
            manualClosure: true,
            originActiveClass: undefined,
            height: 'auto',
            panelClass: 'ai-table-field-setting-panel',
            initialState: {
                aiTable: this.aiTable(),
                aiReferences: this.references(),
                aiEditField: newField,
                isUpdate: false
            }
        });
        if (popoverRef) {
            (popoverRef.componentInstance as AITableFieldSetting).addField.subscribe((defaultValue) => {
                const fields = this.aiTable().gridData().fields;
                const fieldCount = fields.length;
                this.actions()?.addField?.({
                    originId: fieldCount > 0 ? fields[fields.length - 1]._id : '',
                    defaultValue
                });
            });
        }
    }

    onFieldValueChange(options: UpdateFieldValueOptions[]): void {
        this.actions()?.updateFieldValues?.(options);
    }

    setSelection(recordId: string) {
        clearSelection(this.aiTable());
        closeExpendCell(this.aiTable());
        const idPath: AIRecordFieldIdPath = [recordId, this.firstField()?._id];
        selectCells(this.aiTable(), idPath);
        setActiveCell(this.aiTable(), idPath);
    }

    private activateField(fieldId: string): void {
        setActiveCell(this.aiTable(), [this.recordId(), fieldId]);
    }

    private formatCellValue(value: any, field: AITableField): string {
        if (value === null || value === undefined) return '';

        switch (field.type) {
            case AITableFieldType.text:
            case AITableFieldType.richText:
                return value?.toString() || '';
            case AITableFieldType.number:
                return value?.toString() || '';
            case AITableFieldType.select:
                return Array.isArray(value)
                    ? value.map((v) => (field.settings as SelectSettings)?.options?.find((o) => o._id === v)?.text || v).join(', ')
                    : value?.text || value;
            case AITableFieldType.date:
                return value ? new Date(value).toLocaleString() : '';
            default:
                return value?.toString() || '';
        }
    }
}
