import { Component, computed } from '@angular/core';
import { AbstractEditCellEditor, AITableQueries } from '@ai-table/grid';
import { AITableField, TextFieldValue } from '@ai-table/utils';
import { ThyInputDirective } from 'ngx-tethys/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-table-text-editor-example',
    template: `
        <div>
            <input thyInput type="text" [(ngModel)]="value" />
        </div>
    `,
    imports: [CommonModule, FormsModule, ThyInputDirective]
})
export class TextEditorExampleComponent extends AbstractEditCellEditor<TextFieldValue, AITableField> {
    value = computed(() => {
        return AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
    });
}
