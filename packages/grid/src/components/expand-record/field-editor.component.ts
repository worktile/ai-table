import {
    Component,
    input,
    output,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    ChangeDetectionStrategy,
    inject,
    ComponentRef,
    computed,
    effect,
    Injector
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AITable, AITableQueries } from '../../core';
import { GRID_CELL_EDITOR_MAP } from '../cell-editors';
import { AbstractEditCellEditor } from '../cell-editors/abstract-cell-editor.component';
import { AITableReferences, UpdateFieldValueOptions } from '@ai-table/utils';

@Component({
    selector: 'ai-field-editor',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="ai-field-editor-wrapper">
            <div *ngIf="!cellValue" class="empty-cell-placeholder">
                <span class="placeholder-text">空</span>
            </div>

            <!-- 动态编辑器 -->
            <ng-container #editorHost></ng-container>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldEditorComponent implements OnInit, OnDestroy {
    aiTable = input.required<AITable>();
    fieldId = input.required<string>();
    recordId = input.required<string>();
    references = input.required<AITableReferences>();
    customFieldEditors = input<Record<string, any>>();

    updateFieldValues = output<UpdateFieldValueOptions[]>();

    @ViewChild('editorHost', { read: ViewContainerRef, static: true })
    editorHost!: ViewContainerRef;

    private destroy$ = new Subject<void>();
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

    ngOnInit(): void {
        this.createEditorComponent();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.destroyEditorComponent();
    }

    private createEditorComponent(): void {
        const field = this.field();
        if (!field) return;

        const editorComponent = this.getEditorComponent(field.type);
        if (!editorComponent) return;

        try {
            this.editorHost.clear();
        } catch (error) {}
        this.editorComponentRef = this.editorHost.createComponent(editorComponent);

        const instance = this.editorComponentRef.instance;
        if (instance instanceof AbstractEditCellEditor) {
            this.editorComponentRef.setInput('aiTable', this.aiTable());
            this.editorComponentRef.setInput('fieldId', this.fieldId());
            this.editorComponentRef.setInput('recordId', this.recordId());
            this.editorComponentRef.setInput('references', this.references());
            this.editorComponentRef.setInput('autoFocus', false);

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
        const customEditors = this.customFieldEditors();
        if (customEditors && customEditors[fieldType]) {
            return customEditors[fieldType];
        }

        return GRID_CELL_EDITOR_MAP[fieldType];
    }
}
