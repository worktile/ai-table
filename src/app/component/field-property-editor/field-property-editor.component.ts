import { ChangeDetectionStrategy, Component, Input, WritableSignal, input, model } from '@angular/core';
import { AITableField, AITableFieldType, AITableFieldPropertyEditor, AITable } from '@ai-table/grid';

@Component({
    selector: 'field-property-editor',
    templateUrl: './field-property-editor.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AITableFieldPropertyEditor]
})
export class FieldPropertyEditor {
    aiField = model.required<AITableField>();

    @Input() aiTable!: AITable;

    @Input() isUpdate!: boolean;

    field!: WritableSignal<AITableField>;

    AITableFieldType = AITableFieldType;
}
