import { AddRecordOptions } from "./add-record";
import { UpdateFieldValueOptions } from "./update-field-value";

export * from "./update-field-value";
export * from "./add-record";

export type ActionOptions = UpdateFieldValueOptions | AddRecordOptions;
