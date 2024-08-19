import { AITableView, AIViewTable, ViewActionName } from '../../types';

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
            type: ViewActionName.SetView,
            properties,
            newProperties,
            path
        };
        aiTable.apply(operation);
    }
}


