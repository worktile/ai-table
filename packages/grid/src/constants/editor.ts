import { AITableFieldType } from '../core';
import { SingleSelectCellEditorComponent } from '../components/cell-editors/single-select/single-select-editor.component';
import { TextCellEditorComponent } from '../components/cell-editors/text/text-editor.component';
import { NumberCellEditorComponent } from '../components/cell-editors/number/number-editor.component';

export const GRID_CELL_EDITOR_MAP: Record<AITableFieldType, any> = {
    [AITableFieldType.Text]: TextCellEditorComponent,
    [AITableFieldType.SingleSelect]: SingleSelectCellEditorComponent,
    [AITableFieldType.Number]: NumberCellEditorComponent
};
