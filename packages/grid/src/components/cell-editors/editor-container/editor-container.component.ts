import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, input } from '@angular/core';
import { AITable, AITableFieldType, AITableRecord } from '../../../core';
import { AITableContext, AITableEditPosition } from '../../../types';
import { SelectCellEditorComponent } from '../select/select-editor.component';
import { TextCellEditorComponent } from '../text/text-editor.component';

@Component({
    selector: 'ai-table-editor-container, [aiTableEditorContainer]',
    templateUrl: './editor-container.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle, TextCellEditorComponent, SelectCellEditorComponent],
    host: {
        id: 'ai-table-editor-container',
        class: 'ai-table-editor-container',
        '[style.left.px]': 'offsetX()',
        '[style.top.px]': 'offsetY()',
        '[style.width.px]': 'containerWidth()',
        '[style.minHeight.px]': 'containerHeight()'
    }
})
export class AITableEditorContainer {
    @Input({ required: true }) aiTable!: AITable;

    context = input.required<AITableContext>();

    record = input.required<AITableRecord>();

    field = input.required<any>();

    editPosition = input.required<AITableEditPosition>();

    AITableFieldType = AITableFieldType;

    scrollState = computed(() => {
        return this.context().scrollState();
    });

    offsetX = computed(() => {
        return this.editPosition()?.x ?? 0;
    });

    offsetY = computed(() => {
        return this.editPosition()?.y ?? 0;
    });

    containerWidth = computed(() => {
        return this.editPosition()?.width ?? 0;
    });

    containerHeight = computed(() => {
        return this.editPosition()?.height ?? 0;
    });

    editorRect = computed(() => {
        const { width, height } = this.editPosition();
        if (width && height) {
            return {
                width,
                minHeight: height
            };
        }
        return {};
    });
}
