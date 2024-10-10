import {
    DateCellEditorComponent,
    LinkCellEditorComponent,
    NumberCellEditorComponent,
    ProgressEditorComponent,
    RatingCellEditorComponent,
    SelectCellEditorComponent,
    TextCellEditorComponent
} from '../components';
import { AITableFieldType } from '../core';

export const GRID_CELL_EDITOR_MAP: Partial<Record<AITableFieldType, any>> = {
    [AITableFieldType.text]: TextCellEditorComponent,
    [AITableFieldType.richText]: TextCellEditorComponent,
    [AITableFieldType.select]: SelectCellEditorComponent,
    [AITableFieldType.number]: NumberCellEditorComponent,
    [AITableFieldType.date]: DateCellEditorComponent,
    [AITableFieldType.rate]: RatingCellEditorComponent,
    [AITableFieldType.link]: LinkCellEditorComponent,
    [AITableFieldType.progress]: ProgressEditorComponent
};
