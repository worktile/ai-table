import { AITable } from '@ai-table/grid';
import { AIViewTable } from '../types';
import { Actions } from '../action';
import { FLUSHING } from '../utils';
import { AITableAction } from '@ai-table/utils';

export const withState = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.actions = [];

    viewTable.apply = (action: AITableAction | AITableAction[]) => {
        console.log('🔧 aiTable.apply：', action);
        const actions = Array.isArray(action) ? action : [action];
        viewTable.actions.push(...actions);

        // 批量执行 actions，变更检测更新 aiTable 的 views、fields、records
        Actions.transform(viewTable, actions);

        if (!FLUSHING.get(viewTable)) {
            FLUSHING.set(viewTable, true);
            Promise.resolve().then(() => {
                FLUSHING.set(viewTable, false);
                viewTable.onChange();
                viewTable.actions = [];
            });
        }
    };

    return aiTable;
};
