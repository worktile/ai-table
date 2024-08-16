import { AITableRecord, AITableRecords } from '@ai-table/grid';
import { createDraft, finishDraft } from 'immer';
import { AITableView, AITableViewAction, AIViewTable, Direction, ViewActionName } from '../../types';

export function setView(aiTable: AIViewTable, value: Partial<AITableView>, path: [string]) {
    const view = aiTable.views().find((item) => item._id === path[0]);
    if (view) {
        const properties: Partial<AITableView> = {};
        const newProperties: Partial<AITableView> = {};
        for (const key in value) {
            const k = key as keyof AITableView;
            if (JSON.stringify(view[k]) !== JSON.stringify(value[k])) {
                if (view.hasOwnProperty(k)) {
                    properties[k] = view[k] as any;
                }
                if (newProperties[k] !== null) {
                    newProperties[k] = value[k] as any;
                }
            }
        }
       

        const operation = {
            type: ViewActionName.setView,
            properties,
            newProperties,
            path
        };
        aiTable.apply(operation);
    }
}

export const GeneralActions = {
    transform(aiTable: AIViewTable, action: AITableViewAction): void {
        const views = createDraft(aiTable.views());
        const records = createDraft(aiTable.records());
        applyView(aiTable, views, records, action);
        aiTable.views.update(() => {
            return finishDraft(views);
        });
        aiTable.records.update(() => {
            return finishDraft(records);
        });
    }
};

export const applyView = (aiTable: AIViewTable, views: AITableView[], records: AITableRecords, options: AITableViewAction) => {
    switch (options.type) {
        case ViewActionName.setView: {
            const view = views.find((item) => item._id === options.path[0]) as AITableView;
            if (view) {
                for (const key in options.newProperties) {
                    const k = key as keyof AITableView;
                    const value = options.newProperties[k];
                    if (value == null) {
                        delete view[k];
                    } else {
                        (view[k] as any) = value;
                    }
                }

                // properties that were previously defined, but are now missing, must be deleted
                for (const key in options.properties) {
                    if (!options.newProperties.hasOwnProperty(key)) {
                        delete view[<keyof AITableView>key];
                    }
                }

                if (options.newProperties['sortCondition']) {
                    const { sortCondition } = options.newProperties;
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
