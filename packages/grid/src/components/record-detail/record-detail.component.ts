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
import { ThyButton } from 'ngx-tethys/button';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopover, ThyPopoverDirective, ThyPopoverRef } from 'ngx-tethys/popover';
import { ThySlideRef } from 'ngx-tethys/slide';
import { AITable, AITableQueries, createDefaultField } from '../../core';
import {
    AITableField,
    AITableFieldType,
    AITableReferences,
    UpdateFieldValueOptions,
    AIRecordFieldIdPath,
    isUndefinedOrNull,
    FieldOptions
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
    transformToCellText,
    getFieldIconPath,
    getI18nTextByKey
} from '../../utils';
import { ThyAction } from 'ngx-tethys/action';
import { AITableFieldMenuItem } from '../../types/field';
import { IconPathMap } from '../../constants';
import { AITableGridI18nKey } from '../../utils/i18n';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';

@Component({
    selector: 'ai-record-detail',
    imports: [
        ThyButton,
        ThyAction,
        ThyIcon,
        ThyDivider,
        ThyPopoverDirective,
        ThyDropdownMenuItemDirective,
        DynamicCellEditorComponent,
        ThyFlexibleText
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

    readonly = computed(() => {
        return this.aiTable().context?.readonly?.();
    });

    currentRecordId = computed(() => {
        const inputId = this.recordId();
        const internalId = this.internalRecordId();
        return internalId || inputId;
    });

    readonly fieldOperationsMenuTemplate = viewChild<TemplateRef<any>>('fieldOperationsMenuTemplate');

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

    i18nTexts = computed(() => ({
        recordUntitled: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.recordUntitled),
        deleteRecord: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.deleteRecord),
        addField: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.addField)
    }));

    recordTitle = computed(() => {
        let title = this.i18nTexts().recordUntitled;

        const field = this.firstField();
        if (field) {
            const cellValue = AITableQueries.getFieldValue(this.aiTable(), [this.currentRecordId(), field._id]);
            if (!this.isUndefinedTitle(cellValue, field)) {
                const options: FieldOptions = {
                    aiTable: this.aiTable(),
                    field,
                    references: this.references()
                };
                title = transformToCellText(cellValue, options);
            }
        }

        return title;
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

    fieldIconPath(field: AITableField) {
        return getFieldIconPath(field) || IconPathMap[field.icon!];
    }

    activeFieldId: string | null = null;

    fieldMenuVisible = signal<Record<string, boolean>>({});

    fieldMenuActive = signal<Record<string, boolean>>({});

    private fieldMenuPopoverRef: ThyPopoverRef<any> | null = null;

    private slideRef = inject(ThySlideRef);

    private thyPopover = inject(ThyPopover);

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

    cellClick(fieldId: string): void {
        this.activateCell(fieldId);
    }

    showFieldMenu(fieldId: string): void {
        this.fieldMenuVisible.set({ [fieldId]: true });
    }

    hideFieldMenu(fieldId: string): void {
        if (!this.fieldMenuPopoverRef) {
            this.fieldMenuVisible.set({ [fieldId]: false });
        }
    }

    fieldMenuMoreClick(e: MouseEvent, fieldId: string) {
        const origin = e.target as HTMLElement;
        const position = origin.getBoundingClientRect();
        this.fieldMenuVisible.set({ [fieldId]: true });
        this.fieldMenuActive.set({ [fieldId]: true });
        let isSelfClose = false;
        this.fieldMenuPopoverRef = this.thyPopover.open(AITableFieldMenu, {
            origin,
            placement: 'bottomRight',
            manualClosure: true,
            initialState: {
                aiTable: this.aiTable(),
                fieldId,
                fieldMenus: this.fieldMenus(),
                origin,
                position,
                execMenuCallback: (data: { menu: AITableFieldMenuItem; popoverRef?: ThyPopoverRef<any> }) => {
                    isSelfClose = true;
                    this.thyPopover.close();
                    data.popoverRef?.beforeClosed().subscribe(() => {
                        this.fieldMenuVisible.set({ [fieldId]: false });
                        this.fieldMenuActive.set({ [fieldId]: false });
                    });
                }
            }
        });
        if (this.fieldMenuPopoverRef) {
            this.fieldMenuPopoverRef.beforeClosed().subscribe(() => {
                if (!isSelfClose) {
                    this.fieldMenuVisible.set({ [fieldId]: false });
                    this.fieldMenuActive.set({ [fieldId]: false });
                }
                this.fieldMenuPopoverRef = null;
            });
        }
    }

    addNewField(e: MouseEvent): void {
        const origin = e.target as HTMLElement;
        const newField = createDefaultField(this.aiTable(), AITableFieldType.text);
        const component = this.aiTable().context?.aiFieldConfig()?.fieldSettingComponent ?? AITableFieldSetting;
        const popoverRef = this.thyPopover.open(component, {
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
        const idPath: AIRecordFieldIdPath = [recordId, this.firstField()?._id];
        selectCells(this.aiTable(), idPath);
        setActiveCell(this.aiTable(), idPath);
    }

    private activateCell(fieldId: string): void {
        clearSelection(this.aiTable());
        setActiveCell(this.aiTable(), [this.recordId(), fieldId]);
    }

    private isUndefinedTitle(value: any, field: AITableField): boolean {
        switch (field.type) {
            case AITableFieldType.text:
                return value === '';
            default:
                return (Array.isArray(value) && value.length === 0) || isUndefinedOrNull(value);
        }
    }
}
