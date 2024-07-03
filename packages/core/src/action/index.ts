import { FieldActions } from "./field";
import { GeneralActions } from "./general";
import { RecordActions } from "./record";

export const Actions = {
    ...GeneralActions,
    ...FieldActions,
    ...RecordActions
};
