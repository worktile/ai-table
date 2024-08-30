import { AITable, AITableAction } from '@ai-table/grid';
import updateFieldValue from './update-field-value';
import { SharedType } from '../../types';
import setNode from './set-node';
import addNode from './add-node';
import removeNode from './remove-node';

export type ActionMapper<O extends AITableAction = AITableAction> = {
    [K in O['type']]: O extends { type: K } ? ApplyFunc<O> : never;
};

export type ApplyFunc<O extends AITableAction = AITableAction> = (sharedType: SharedType, op: O) => SharedType;

export const actionMappers: Partial<ActionMapper<any>> = {
    add_record: addNode,
    update_field_value: updateFieldValue,
    remove_record: removeNode,
    add_field: addNode,
    set_field: setNode,
    remove_field: removeNode,
    set_view: setNode,
    add_view: addNode,
    remove_view: removeNode,
    add_record_position: addNode,
    remove_record_position: removeNode
};

export function applyActionOps(sharedType: SharedType, actions: AITableAction[], aiTable: AITable): SharedType {
    if (actions.length > 0) {
        sharedType.doc!.transact(() => {
            actions.forEach((action) => {
                const apply = actionMappers[action.type] as ApplyFunc<typeof action>;
                if (apply) {
                    return apply(sharedType, action);
                }
                return null;
            });
        }, aiTable);
    }

    return sharedType;
}
