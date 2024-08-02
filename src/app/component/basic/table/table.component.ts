import { AITableGrid } from '@ai-table/grid';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { CommonTableComponent } from '../../common/table.component';
import { FieldPropertyEditor } from '../../common/field-property-editor/field-property-editor.component';

@Component({
    selector: 'ai-table-demo',
    standalone: true,
    imports: [RouterOutlet, CommonTableComponent, AITableGrid, ThyPopoverModule, FieldPropertyEditor, ThyAction],
    templateUrl: './table.component.html'
})
export class TableComponent extends CommonTableComponent {}
