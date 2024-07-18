import { ChangeDetectionStrategy, Component, Input, WritableSignal, input } from '@angular/core';
import { AITableFields, AITableField, AITableFieldType, AITableFieldPropertyEditor, AITable } from '@ai-table/grid';

@Component({
    selector: 'field-property-editor',
    templateUrl: './field-property-editor.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AITableFieldPropertyEditor]
})
export class FieldPropertyEditor {
    aiFields = input.required<AITableFields>();

    @Input() aiTable!: AITable;

    @Input() aiField!: AITableField;

    field!: WritableSignal<AITableField>;

    AITableFieldType = AITableFieldType;

    aiFieldInitialized(field: WritableSignal<AITableField>) {
        this.field = field;
    }
}
