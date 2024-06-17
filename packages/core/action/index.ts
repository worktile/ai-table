import { AddColumnOptions } from "./add-column";
import { AddRecordOptions } from "./add-record";
import { UpdateFieldValueOptions } from "./update-field-value";

export type ActionOptions =
    | UpdateFieldValueOptions
    | AddRecordOptions
    | AddColumnOptions;
