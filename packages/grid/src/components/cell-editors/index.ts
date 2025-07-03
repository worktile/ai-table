import { AITableFieldType } from '@ai-table/utils';
import { TextCellEditorComponent } from './text/text-editor.component';
import { SelectCellEditorComponent } from './select/select-editor.component';
import { NumberCellEditorComponent } from './number/number-editor.component';
import { DateCellEditorComponent } from './date/date-editor.component';
import { LinkCellEditorComponent } from './link/link-editor.component';

export const GRID_CELL_EDITOR_MAP: Partial<Record<AITableFieldType | string, any>> = {
    [AITableFieldType.text]: TextCellEditorComponent,
    [AITableFieldType.richText]: TextCellEditorComponent,
    [AITableFieldType.select]: SelectCellEditorComponent,
    [AITableFieldType.number]: NumberCellEditorComponent,
    [AITableFieldType.date]: DateCellEditorComponent,
    [AITableFieldType.link]: LinkCellEditorComponent
};
