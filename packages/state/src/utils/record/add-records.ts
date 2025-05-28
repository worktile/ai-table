import { AITableSelectAllState, getDefaultFieldValue, idsCreator, shortIdsCreator } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import { getSortFields } from '../field/sort-fields';
import { Actions } from '../../action';
import { checkConditions, getDefaultRecordDataByFilter } from './filter';
import { AddRecordOptions, AITableRecord, AITableViewFields, FieldValue, TrackableEntity } from '@ai-table/utils';

export function addRecords(aiTable: AIViewTable, trackableEntity: TrackableEntity, options?: AddRecordOptions) {
    options = options || {};
    let { originId, isDuplicate, count = 1 } = options;
    const recordCount = aiTable.records().length;
    const maxRecordCount = aiTable.context?.maxRecords();
    if (maxRecordCount && recordCount + count > maxRecordCount) {
        count = maxRecordCount! - recordCount;
        options.count = count;
    }
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    const newRecordIds = idsCreator(count);
    const newRecordShortIds = shortIdsCreator(count);
    const newRecordValues = getDefaultRecordValues(aiTable, isDuplicate, originId);
    const newRecords: AITableRecord[] = [];
    const hiddenRecordIds: string[] = [];
    newRecordIds.forEach((id, index) => {
        const record = { _id: id, short_id: newRecordShortIds[index], values: newRecordValues, ...trackableEntity };
        if (activeView.settings?.conditions?.length) {
            const conditions = aiTable.viewsMap()[aiTable.activeViewId()].settings?.conditions;
            const conditionLogical = aiTable.viewsMap()[aiTable.activeViewId()].settings?.condition_logical;
            const checkResult = checkConditions(aiTable, aiTable.fields() as AITableViewFields, record, {
                conditions,
                condition_logical: conditionLogical
            });
            if (!checkResult) {
                hiddenRecordIds.push(id);
            }
        }

        newRecords.push(record);
    });
    if (hiddenRecordIds.length) {
        aiTable.recordsWillHidden?.update((value) => {
            return [...value, ...hiddenRecordIds];
        });
    }
    Actions.addRecords(aiTable, newRecords, options);
    const recentAddRecord = options.isInsertBefore ? newRecords[newRecords.length - 1] : newRecords[0];
    aiTable.selection.set({
        selectedRecords: new Set(),
        selectedFields: new Set(),
        selectedCells: new Set(),
        activeCell: [recentAddRecord._id, aiTable.gridData().fields[0]._id],
        selectAllState: AITableSelectAllState.none
    });
}

export function getDefaultRecordValues(aiTable: AIViewTable, isDuplicate = false, recordId?: string) {
    let newRecordValues: Record<string, FieldValue> = {};
    if (isDuplicate && recordId) {
        newRecordValues = aiTable.recordsMap()[recordId].values;
    } else {
        const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
        const fields = getSortFields(aiTable, aiTable.fields() as AITableViewFields, activeView);
        fields.map((item) => {
            newRecordValues[item._id] = getDefaultFieldValue(item);
        });
        const { conditions, condition_logical } = activeView.settings || {};
        if (conditions && conditions.length) {
            newRecordValues = getDefaultRecordDataByFilter(newRecordValues, conditions, fields, condition_logical);
        }
    }
    return newRecordValues;
}
