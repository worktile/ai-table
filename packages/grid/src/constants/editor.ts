import { AITableFieldType } from '../core';
import { TextCellEditorComponent } from '../components/cell-editors/text/text-editor.component';
import { NumberCellEditorComponent } from '../components/cell-editors/number/number-editor.component';
import { DateTimeCellEditorComponent } from '../components/cell-editors/date-time/date-time-editor.component';
import { RatingCellEditorComponent } from '../components/cell-editors/rating/rating-editor.component';
import { LinkCellEditorComponent } from '../components/cell-editors/link/number-editor.component';
import { SelectCellEditorComponent } from '../components/cell-editors/select/select-editor.component';

export const GRID_CELL_EDITOR_MAP: Partial<Record<AITableFieldType, any>> = {
    [AITableFieldType.text]: TextCellEditorComponent,
    [AITableFieldType.select]: SelectCellEditorComponent,
    [AITableFieldType.number]: NumberCellEditorComponent,
    [AITableFieldType.date]: DateTimeCellEditorComponent,
    [AITableFieldType.rate]: RatingCellEditorComponent,
    [AITableFieldType.link]: LinkCellEditorComponent
};
