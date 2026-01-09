import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    effect,
    untracked,
    inject,
    input,
    output,
    signal,
    viewChild,
    model
} from '@angular/core';
import { ThyButton } from 'ngx-tethys/button';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopover, ThyPopoverRef } from 'ngx-tethys/popover';
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
import { ThyDropdownDirective, ThyDropdownMenuComponent } from 'ngx-tethys/dropdown';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';

@Component({
    selector: 'ai-record-detail',
    imports: [
        ThyButton,
        ThyAction,
        ThyIcon,
        ThyDivider,
        ThyDropdownDirective,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuComponent,
        DynamicCellEditorComponent,
        ThyFlexibleText,
        ThyTooltipDirective
    ],
    templateUrl: './record-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent {
    readonly aiTable = input.required<AITable>();

    readonly recordId = model.required<string>();

    readonly references = input.required<AITableReferences>();

    readonly actions = input<AITableActions>();

    readonly recordIdChange = output<string>();

    private internalRecordId = signal<string>('');

    readonly = computed(() => {
        return this.aiTable()?.context?.readonly?.();
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
        previousRecord: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.previousRecord),
        nextRecord: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.nextRecord),
        more: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.more),
        close: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.close),
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

    fieldMenuActive = signal<Record<string, boolean>>({});

    private fieldMenuPopoverRef: ThyPopoverRef<any> | null = null;

    private currentPopoverFieldId: string | null = null;

    private slideRef = inject(ThySlideRef);

    private thyPopover = inject(ThyPopover);

    constructor() {
        effect(() => {
            const recordId = this.recordId();
            untracked(() => {
                this.setSelection(recordId);
                this.internalRecordId.set(recordId);
            });
        });

        effect(() => {
            const activeCell = this.aiTable().selection().activeCell;
            if (activeCell) {
                this.internalRecordId.set(activeCell[0]);
            }
        });

        effect(() => {
            const fields = this.fields();
            if (this.currentPopoverFieldId && this.fieldMenuPopoverRef) {
                const fieldExists = fields.some((field) => field._id === this.currentPopoverFieldId);
                if (!fieldExists) {
                    this.fieldMenuPopoverRef.close();
                    this.fieldMenuPopoverRef = null;
                    this.currentPopoverFieldId = null;
                }
            }
        });
    }

    updateRecordId(recordId: string): void {
        this.recordId.set(recordId);
    }

    close(): void {
        this.slideRef?.close();
    }

    previousRecord(): void {
        const prevId = getPreviousRecordByActiveCell(this.aiTable());
        if (prevId) {
            this.updateRecordId(prevId);
        }
    }

    nextRecord(): void {
        const nextId = getNextRecordByActiveCell(this.aiTable());
        if (nextId) {
            this.updateRecordId(nextId);
        }
    }

    deleteRecord(): void {
        this.actions()?.removeRecord?.([this.currentRecordId()]);
        this.close();
    }

    cellClick(fieldId: string): void {
        this.activateCell(fieldId);
    }

    fieldMenuMoreClick(e: Event, fieldId: string, fieldMenuOrigin: HTMLDivElement) {
        const origin = e.currentTarget as HTMLElement;
        const position = fieldMenuOrigin.getBoundingClientRect();
        this.fieldMenuActive.set({ [fieldId]: true });
        this.currentPopoverFieldId = fieldId;
        let isSelfClose = false;
        this.fieldMenuPopoverRef =
            this.thyPopover.open(AITableFieldMenu, {
                origin,
                placement: 'bottomRight',
                initialState: {
                    aiTable: this.aiTable(),
                    fieldId,
                    fieldMenus: this.fieldMenus(),
                    origin: fieldMenuOrigin,
                    position,
                    execMenuCallback: (data: { menu: AITableFieldMenuItem; popoverRef?: ThyPopoverRef<any> }) => {
                        isSelfClose = true;
                        data.popoverRef?.beforeClosed().subscribe(() => {
                            this.fieldMenuActive.set({ [fieldId]: false });
                        });
                    }
                }
            }) ?? null;
        if (this.fieldMenuPopoverRef) {
            this.fieldMenuPopoverRef.beforeClosed().subscribe(() => {
                if (!isSelfClose) {
                    this.fieldMenuActive.set({ [fieldId]: false });
                }
                this.fieldMenuPopoverRef = null;
                this.currentPopoverFieldId = null;
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
