import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    computed,
    effect,
    inject,
    input,
    output,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { ThySlideRef } from 'ngx-tethys/slide';
import { Subject, takeUntil, filter } from 'rxjs';
import { AITable, AITableQueries, createDefaultField } from '../../core';
import { GridControlService } from '../../services/grid-control.service';
import {
    AITableField,
    AITableFieldType,
    AITableReferences,
    UpdateFieldValueOptions,
    SelectSettings,
    AddFieldOptions,
    IdPath
} from '@ai-table/utils';
import { AITableFieldMenu } from '../field-menu/field-menu.component';
import { FieldEditorComponent } from './field-editor.component';
import { AITableFieldSetting } from '../field-setting/field-setting.component';
import { ThyDivider } from 'ngx-tethys/divider';
import { ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';

@Component({
    selector: 'ai-expand-record',
    standalone: true,
    imports: [
        CommonModule,
        ScrollingModule,
        ThyButtonModule,
        ThyIconModule,
        ThyDivider,
        ThyPopoverModule,
        ThyDropdownMenuItemDirective,
        FieldEditorComponent,
        AITableFieldMenu
    ],
    templateUrl: './expand-record.component.html',
    styleUrls: ['./expand-record.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandRecordComponent implements OnInit, OnDestroy {
    aiTable = input.required<AITable>();
    recordId = input.required<string>();
    references = input.required<AITableReferences>();

    // 添加字段
    addField = input<(options: AddFieldOptions) => void>();

    // 删除行
    removeRecord = input<(path: IdPath) => void>();

    // 字段值更新
    fieldValueChange = input<(options: UpdateFieldValueOptions[]) => void>();

    // 自定义字段编辑组件
    customFieldEditors = input<Record<string, any>>();

    // 自定义更多菜单模板
    headerMoreMenuTemplate = input<TemplateRef<any>>();

    // 自定义字段操作模板
    fieldOperationsTemplate = input<TemplateRef<any>>();

    recordIdChange = output<string>();

    private internalRecordId = signal<string>('');

    currentRecordId = computed(() => {
        const inputId = this.recordId();
        const internalId = this.internalRecordId();
        return internalId || inputId;
    });

    @ViewChild('editorContainer', { read: ViewContainerRef })
    editorContainer!: ViewContainerRef;

    @ViewChild('fieldOperationsMore') fieldOperationsMoreRef!: ElementRef;

    @ViewChild('addFieldButton') addFieldButtonRef!: ElementRef<HTMLElement>;

    get fieldOperationsMorePosition() {
        return this.fieldOperationsMoreRef.nativeElement.getBoundingClientRect();
    }

    private destroy$ = new Subject<void>();
    private slideRef = inject(ThySlideRef, { optional: true });
    private gridControl = inject(GridControlService);
    private cdr = inject(ChangeDetectorRef);
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
        return this.gridControl.getRecordPosition(this.currentRecordId());
    });

    fieldMenus = computed(() => {
        const fieldMenusFn = this.aiTable()?.context?.aiFieldConfig()?.fieldMenus;
        if (fieldMenusFn && this.aiTable()) {
            return fieldMenusFn(this.aiTable(), 'expand-record');
        }
        return [];
    });

    activeFieldId: string | null = null;

    fieldMenuVisible: Record<string, boolean> = {};

    constructor() {
        effect(() => {
            this.internalRecordId.set(this.recordId());
        });
    }

    ngOnInit(): void {
        this.gridControl.init(this.aiTable());
        setTimeout(() => {
            // 首次激活cell
            this.gridControl.setActiveRecord(this.recordId());
            this.gridControl.setActiveCell(this.recordId(), this.firstField()?._id);
        });
        this.internalRecordId.set(this.recordId());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    close(): void {
        this.slideRef?.close();
    }

    previousRecord(): void {
        const prevId = this.gridControl.previousRecord();
        if (prevId) {
            this.internalRecordId.set(prevId);
            this.gridControl.setActiveRecord(prevId);
            this.gridControl.setActiveCell(prevId, this.firstField()?._id);
        }
    }

    nextRecord(): void {
        const nextId = this.gridControl.nextRecord();
        if (nextId) {
            this.internalRecordId.set(nextId);
            this.gridControl.setActiveRecord(nextId);
            this.gridControl.setActiveCell(nextId, this.firstField()?._id);
        }
    }

    deleteRecord(): void {
        this.removeRecord()?.([this.currentRecordId()]);
        this.close();
    }

    onFieldClick(fieldId: string): void {
        this.activateField(fieldId);

        // 通知表格同步选中
        this.gridControl.setActiveCell(this.currentRecordId(), fieldId, {
            scroll: true
        });
    }

    showFieldMenu(fieldId: string): void {
        this.fieldMenuVisible[fieldId] = true;
    }

    hideFieldMenu(fieldId: string): void {
        this.fieldMenuVisible[fieldId] = false;
    }

    addNewField(): void {
        const addFieldButtonElement = this.addFieldButtonRef.nativeElement;
        const newField = createDefaultField(this.aiTable(), AITableFieldType.text);
        const popoverRef = this.thyPopover.open(AITableFieldSetting, {
            origin: addFieldButtonElement,
            originPosition: addFieldButtonElement.getBoundingClientRect(),
            placement: 'bottomLeft',
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
                this.addField()?.({
                    originId: fieldCount > 0 ? fields[fields.length - 1]._id : '',
                    defaultValue
                });
            });
        }
    }

    onFieldValueChange(options: UpdateFieldValueOptions[]): void {
        this.fieldValueChange()?.(options);
    }

    private activateField(fieldId: string): void {
        this.gridControl.setActiveCell(this.recordId(), fieldId);
        this.cdr.markForCheck();
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
