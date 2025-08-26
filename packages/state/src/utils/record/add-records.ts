import { AITableSelectAllState, getDefaultFieldValue, idsCreator, setSelection, shortIdCreator, shortIdsCreator } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import { getSortFields } from '../field/sort-fields';
import { Actions } from '../../action';
import { checkConditions, getDefaultRecordDataByFilter } from './filter';
import { AddRecordOptions, AITableRecord, AITableViewFields, FieldValue, idCreator, TrackableEntity } from '@ai-table/utils';

export function addRecords(aiTable: AIViewTable, trackableEntity: TrackableEntity, options?: AddRecordOptions) {
    options = options || {};
    const newRecords: AITableRecord[] = [];
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    const groups = activeView.settings?.groups;
    if (!groups?.length) {
        let { originId, isDuplicate, count = 1 } = options;
        const recordCount = aiTable.records().length;
        const maxRecordCount = aiTable.context?.maxRecords();
        if (maxRecordCount && recordCount + count > maxRecordCount) {
            count = maxRecordCount! - recordCount;
            options.count = count;
        }
        const newRecordIds = idsCreator(count);
        const newRecordShortIds = shortIdsCreator(count);
        const newRecordValues = getDefaultRecordValues(aiTable, isDuplicate, originId);
        const hiddenRecordIds: string[] = [];
        newRecordIds.forEach((id, index) => {
            const record = { _id: id, short_id: newRecordShortIds[index], values: newRecordValues, ...trackableEntity };
            const checkResult = checkConditions(aiTable, aiTable.fields() as AITableViewFields, record);
            if (!checkResult) {
                hiddenRecordIds.push(id);
            }
            newRecords.push(record);
        });
        if (hiddenRecordIds.length) {
            aiTable.recordsWillHidden?.update((value) => {
                return [...value, ...hiddenRecordIds];
            });
        }
    } else {
        if (options.recordId) {
            const originRecord = getDefaultRecordValues(aiTable, true, options.recordId);
            const newValues: Record<string, FieldValue> = {};
            groups.forEach((group) => {
                newValues[group.fieldId] = originRecord[group.fieldId];
            });
            const newRecord = { _id: idCreator(), short_id: shortIdCreator(), values: newValues, ...trackableEntity };
            newRecords.push(newRecord);
        } else {
            return;
        }
    }
    Actions.addRecords(aiTable, newRecords, options);
    const recentAddRecord = options.isInsertBefore ? newRecords[newRecords.length - 1] : newRecords[0];
    const activeRecordId = recentAddRecord._id;
    const activeFieldId = aiTable.gridData().fields[0]._id;
    setSelection(aiTable, {
        selectedRecords: new Set([]),
        selectedFields: new Set([]),
        selectedCells: new Set([`${activeRecordId}:${activeFieldId}`]),
        activeCell: [activeRecordId, activeFieldId]
    });
}

export function getDefaultRecordValues(aiTable: AIViewTable, isDuplicate = false, recordId?: string) {
    let newRecordValues: Record<string, FieldValue> = {};
    if (isDuplicate && recordId) {
        newRecordValues = aiTable.recordsMap()[recordId].values;
    } else {
        const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
        const fields = getSortFields(aiTable, aiTable.fields() as AITableViewFields, activeView);
        fields.map((field) => {
            const customGetDefaultFieldValue = aiTable.context?.aiFieldConfig()?.customFields?.[field.type]?.getDefaultFieldValue;
            if (customGetDefaultFieldValue) {
                newRecordValues[field._id] = customGetDefaultFieldValue(field);
            } else {
                newRecordValues[field._id] = getDefaultFieldValue(field);
            }
        });
        const { conditions, condition_logical } = activeView.settings || {};
        if (conditions && conditions.length) {
            newRecordValues = getDefaultRecordDataByFilter(newRecordValues, conditions, fields, condition_logical);
        }
    }
    return newRecordValues;
}
