import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    TemplateRef,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
    viewChild
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkVirtualForOf, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { ThyButton } from 'ngx-tethys/button';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopover, ThyPopoverDirective } from 'ngx-tethys/popover';
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
import {
    AITableActions,
    clearSelection,
    closeExpendCell,
    getRecordNavigationInfo,
    getNextRecordByActiveCell,
    getPreviousRecordByActiveCell,
    selectCells,
    setActiveCell,
    transformToCellText
} from '../../utils';

@Component({
    selector: 'ai-record-detail',
    imports: [
        CdkVirtualScrollViewport,
        CdkVirtualForOf,
        ThyButton,
        ThyIcon,
        ThyDivider,
        ThyPopoverDirective,
        ThyDropdownMenuItemDirective,
        DynamicCellEditorComponent,
        CdkFixedSizeVirtualScroll
    ],
    templateUrl: './record-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit {
    readonly aiTable = input.required<AITable>();
    readonly recordId = input.required<string>();
    readonly references = input.required<AITableReferences>();

    readonly actions = input<AITableActions>();

    readonly recordIdChange = output<string>();

    private internalRecordId = signal<string>('');

    currentRecordId = computed(() => {
        const inputId = this.recordId();
        const internalId = this.internalRecordId();
        return internalId || inputId;
    });

    readonly fieldOperationsMenuTemplate = viewChild<TemplateRef<any>>('fieldOperationsMenuTemplate');

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

    recordNavigation = computed(() => {
        return getRecordNavigationInfo(this.aiTable(), this.currentRecordId());
    });

    fieldMenus = computed(() => {
        const fieldMenusFn = this.aiTable()?.context?.aiFieldConfig()?.recordDetailFieldMenus;
        if (fieldMenusFn && this.aiTable()) {
            return fieldMenusFn(this.aiTable());
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

    fieldClick(fieldId: string): void {
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
        this.thyPopover.open(AITableFieldMenu, {
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
        });
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

    fieldValueChange(options: UpdateFieldValueOptions[]): void {
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
        const transformValue = transformToCellText(value, { aiTable: this.aiTable(), field });
        switch (field.type) {
            case AITableFieldType.text:
            case AITableFieldType.richText:
            case AITableFieldType.number:
                return transformValue;
            case AITableFieldType.select:
                return Array.isArray(transformValue)
                    ? transformValue.map((v) => (field.settings as SelectSettings)?.options?.find((o) => o._id === v)?.text || v).join(', ')
                    : transformValue?.text || transformValue;
            case AITableFieldType.date:
                return transformValue ? new Date(transformValue).toLocaleString() : '';
            default:
                return transformValue;
        }
    }
}
