import { AITableRecord, AITableRecords } from '@ai-table/grid';
import { AITableViewAction, SharedAITable, ViewActionName } from '@ai-table/shared';
import { createDraft, finishDraft } from 'immer';
import { AITableView, Direction } from '../types/view';

export function setView(aiTable: SharedAITable, value: Partial<AITableView>, path: [number]) {
    const [index] = path;
    const view: AITableView = aiTable.views()[index];
    const oldView: Partial<AITableView> = {};
    const newView: Partial<AITableView> = {};
    for (const key in value) {
        const k = key as keyof AITableView;
        if (JSON.stringify(view[k]) !== JSON.stringify(value[k])) {
            if (view.hasOwnProperty(key)) {
                oldView[k] = view[k] as any;
            }
            newView[k] = value[k] as any;
        }
    }
    const operation = {
        type: ViewActionName.setView,
        view: oldView,
        newView,
        path
    };
    aiTable.apply(operation);
}

export const GeneralActions = {
    transform(aiTable: SharedAITable, op: AITableViewAction): void {
        const views = createDraft(aiTable.views());
        const records = createDraft(aiTable.records());
        applyView(aiTable, views, records, op);
        aiTable.views.update(() => {
            return finishDraft(views);
        });
        aiTable.records.update(() => {
            return finishDraft(records);
        });
    }
};

export const applyView = (aiTable: SharedAITable, views: AITableView[], records: AITableRecords, options: AITableViewAction) => {
    switch (options.type) {
        case ViewActionName.setView: {
            const [viewIndex] = options.path;
            if (viewIndex > -1) {
                views[viewIndex] = {
                    ...views[viewIndex],
                    ...options.newView
                };
                if (options.newView['sortCondition']) {
                    const { sortCondition } = options.newView;
                    const { sortBy, direction } = sortCondition.conditions[0];
                    records = records.sort((a: AITableRecord, b: AITableRecord) => {
                        return direction === Direction.ascending
                            ? a.values[sortBy] - b.values[sortBy]
                            : b.values[sortBy] - a.values[sortBy];
                    });
                }
            }
        }
    }
};

export const ViewActions = {
    setView,
    applyView
};