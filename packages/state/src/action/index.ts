import { FieldActions } from './field';
import { GeneralActions } from './general';
import { PositionsActions } from './position';
import { RecordActions } from './record';
import { ViewActions } from './view';
import { GroupActions } from './group';

export const Actions = {
    ...GeneralActions,
    ...RecordActions,
    ...FieldActions,
    ...ViewActions,
    ...PositionsActions,
    ...GroupActions
};

export { buildSetRecordPositionsAction } from './position';

export { buildSetFieldAction } from './field';
