import { ChangeDetectionStrategy, Component, Input, WritableSignal, booleanAttribute, computed, model } from '@angular/core';
import { AITableField, AITableFieldType, AITableFieldPropertyEditor, AITable } from '@ai-table/grid';

@Component({
    selector: 'field-property-editor',
    templateUrl: './field-property-editor.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AITableFieldPropertyEditor]
})
export class FieldPropertyEditor {
    aiEditField = model.required<AITableField>();

    @Input({ required: true }) aiTable!: AITable;

    @Input({ transform: booleanAttribute }) isUpdate!: boolean;

    AITableFieldType = AITableFieldType;
}
