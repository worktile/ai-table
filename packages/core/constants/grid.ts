import { SelectComponent } from "../components/grid/columns/select/select.component";
import { TextComponent } from "../components/grid/columns/text/text.component";
import { ColumnType } from "../types";

export const GridColumnMap = {
    [ColumnType.text]: {
        component: TextComponent,
    }
};
