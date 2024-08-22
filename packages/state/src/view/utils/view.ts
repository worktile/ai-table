import { idCreator } from '@ai-table/grid';
import { AITableView, AITableViews } from '../../types';

export function getDefaultView(views: AITableViews, recordPositions?: string[], fieldPositions?: string[]): AITableView | undefined {
    if (!views.length) {
        return undefined;
    }

    const view: AITableView = {
        _id: idCreator(),
        name: '表格视图 ' + views.length,
        recordPositions: recordPositions ?? views[0].recordPositions,
        fieldPositions: fieldPositions ?? views[0].fieldPositions
    };
    return view;
}
