import {
    Component,
    input,
    output,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    ChangeDetectionStrategy,
    ComponentRef,
    computed,
    effect,
    viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AITable, AITableQueries } from '../../core';
import { GRID_CELL_EDITOR_MAP } from '../cell-editors';
import { AbstractEditCellEditor } from '../cell-editors/abstract-cell-editor.component';
import { AITableFieldType, AITableReferences, UpdateFieldValueOptions } from '@ai-table/utils';
import { AITableCommonTriggerSource, AITableGridCellRenderSchema } from '../../types';

@Component({
    selector: 'ai-dynamic-cell-editor',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="ai-dynamic-cell-editor-wrapper">
            @if (!cellValue()) {
                <div class="empty-cell-placeholder">
                    <span class="placeholder-text">空</span>
                </div>
            }
            <ng-container #editorHost></ng-container>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicCellEditorComponent implements OnInit, OnDestroy {
    aiTable = input.required<AITable>();
    fieldId = input.required<string>();
    recordId = input.required<string>();
    references = input.required<AITableReferences>();
    customCellEditors = input<Record<AITableFieldType | string, AITableGridCellRenderSchema>>();

    updateFieldValues = output<UpdateFieldValueOptions[]>();

    readonly editorHost = viewChild('editorHost', { read: ViewContainerRef });

    private editorComponentRef?: ComponentRef<any>;

    field = computed(() => {
        return this.aiTable().fieldsMap()[this.fieldId()];
    });

    cellValue = computed(() => {
        return AITableQueries.getFieldValue(this.aiTable(), [this.recordId(), this.fieldId()]);
    });

    constructor() {
        effect(() => {
            this.recordId();
            this.fieldId();
            // 重新创建编辑器
            this.createEditorComponent();
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroyEditorComponent();
    }

    private createEditorComponent(): void {
        const field = this.field();
        if (!field) return;

        const editorComponent = this.getEditorComponent(field.type);
        if (!editorComponent) return;

        const editorHost = this.editorHost();
        try {
            editorHost?.clear();
        } catch (error) {}
        this.editorComponentRef = editorHost?.createComponent(editorComponent);

        const instance = this.editorComponentRef!.instance;
        if (instance instanceof AbstractEditCellEditor) {
            this.editorComponentRef!.setInput('aiTable', this.aiTable());
            this.editorComponentRef!.setInput('fieldId', this.fieldId());
            this.editorComponentRef!.setInput('recordId', this.recordId());
            this.editorComponentRef!.setInput('references', this.references());
            this.editorComponentRef!.setInput('autoFocus', false);
            this.editorComponentRef!.setInput('source', 'record-detail' as AITableCommonTriggerSource);

            instance.updateFieldValues.subscribe((options: UpdateFieldValueOptions[]) => {
                this.updateFieldValues.emit(options);
            });
        }
    }

    private destroyEditorComponent(): void {
        if (this.editorComponentRef) {
            this.editorComponentRef.destroy();
            this.editorComponentRef = undefined;
        }
    }

    private getEditorComponent(fieldType: string): any {
        const customEditors = this.customCellEditors();
        if (customEditors && customEditors[fieldType]?.editor) {
            return customEditors[fieldType].editor;
        }

        return GRID_CELL_EDITOR_MAP[fieldType];
    }
}
