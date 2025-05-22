import { getDefaultFieldValue, idsCreator, shortIdsCreator } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import { getSortFields } from '../field/sort-fields';
import { Actions } from '../../action';
import { getDefaultRecordDataByFilter } from './filter';
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
    if (activeView.settings?.conditions?.length) {
        aiTable.recordsWillHidden?.update((value) => {
            value.push(...newRecordIds);
            return [...value];
        });
    }
    const newRecords = newRecordIds.map((id, index) => {
        return { _id: id, short_id: newRecordShortIds[index], values: newRecordValues, ...trackableEntity };
    });
    Actions.addRecords(aiTable, newRecords, options);
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
