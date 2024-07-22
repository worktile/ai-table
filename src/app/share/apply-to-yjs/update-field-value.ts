import { SharedType } from '../shared';
import { UpdateFieldValueAction } from '@ai-table/grid';

export default function updateFieldValue(sharedType: SharedType, action: UpdateFieldValueAction): SharedType {
    const records = sharedType.get('records');
    if (records) {
        const node = records?.get(action.path[0]).get('value').get(action.path[1]);
        node.set('fieldValue', action.newFieldValue);
    }

    return sharedType;
}
