import { FieldActions } from './field';
import { GeneralActions } from './general';
import { PositionActions } from './position';
import { RecordActions } from './record';
import { ViewActions } from './view';

export const Actions = {
    ...GeneralActions,
    ...RecordActions,
    ...FieldActions,
    ...ViewActions,
    ...PositionActions
};
