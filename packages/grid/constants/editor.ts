import { VTableFieldType } from "../../core";
import { SingleSelectCellEditorComponent } from "../components/cell-editors/single-select/single-select-editor.component";
import { TextCellEditorComponent } from "../components/cell-editors/text/text-editor.component";

export const GRID_CELL_EDITOR_MAP: Record<VTableFieldType, any> = {
    [VTableFieldType.Text]: TextCellEditorComponent,
    [VTableFieldType.SingleSelect]: SingleSelectCellEditorComponent,
};
