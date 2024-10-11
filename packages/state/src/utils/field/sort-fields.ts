import { AITable } from "@ai-table/grid";
import { AITableView, AITableViewFields } from "../../types";
import { sortByViewPosition } from "../common";

export function getSortFields(aiTable: AITable, fields: AITableViewFields, activeView: AITableView) {
    return sortByViewPosition(fields as AITableViewFields, activeView) as AITableViewFields;
}
