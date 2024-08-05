import {
    DateTimeCellEditorComponent,
    LinkCellEditorComponent,
    NumberCellEditorComponent,
    ProgressEditorComponent,
    RatingCellEditorComponent,
    TextCellEditorComponent
} from '../components';
import { SelectCellEditorComponent } from '../components/cell-editors/select/select-editor.component';
import { AITableFieldType } from '../core';

export const GRID_CELL_EDITOR_MAP: Record<AITableFieldType, any> = {
    [AITableFieldType.text]: TextCellEditorComponent,
    [AITableFieldType.richText]: TextCellEditorComponent,
    [AITableFieldType.select]: SelectCellEditorComponent,
    [AITableFieldType.number]: NumberCellEditorComponent,
    [AITableFieldType.date]: DateTimeCellEditorComponent,
    [AITableFieldType.rate]: RatingCellEditorComponent,
    [AITableFieldType.link]: LinkCellEditorComponent,
    [AITableFieldType.progress]: ProgressEditorComponent,
    [AITableFieldType.member]: null
};
