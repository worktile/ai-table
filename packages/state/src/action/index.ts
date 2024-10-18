import { FieldActions } from './field';
import { GeneralActions } from './general';
import { PositionsActions } from './position';
import { RecordActions } from './record';
import { ViewActions } from './view';

export const Actions = {
    ...GeneralActions,
    ...RecordActions,
    ...FieldActions,
    ...ViewActions,
    ...PositionsActions
};
