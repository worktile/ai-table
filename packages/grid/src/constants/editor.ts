import { AITableFieldType } from '@ai-table/utils';
import {
    DateCellEditorComponent,
    LinkCellEditorComponent,
    NumberCellEditorComponent,
    SelectCellEditorComponent,
    TextCellEditorComponent
} from '../components';

export const GRID_CELL_EDITOR_MAP: Partial<Record<AITableFieldType, any>> = {
    [AITableFieldType.text]: TextCellEditorComponent,
    [AITableFieldType.richText]: TextCellEditorComponent,
    [AITableFieldType.select]: SelectCellEditorComponent,
    [AITableFieldType.number]: NumberCellEditorComponent,
    [AITableFieldType.date]: DateCellEditorComponent,
    [AITableFieldType.link]: LinkCellEditorComponent
};
