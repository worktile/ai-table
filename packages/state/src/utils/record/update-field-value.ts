import { AITableQueries } from '@ai-table/grid';
import * as _ from 'lodash';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';
import {
    UpdateFieldValueOptions,
    AITableRecordUpdatedInfo,
    AITableSystemFieldValueOption,
    AITableViewFields,
    AITableRecord,
    AITableViewRecord
} from '@ai-table/utils';
import { checkConditions } from './filter';
import { sortRecordsByConditions } from './sort';
import { buildGroupLinearRows, buildSorts } from '../build';
import { getParentLinearRowGroups } from '../group';

function updateWillHiddenRecordIds(
    aiTable: AIViewTable,
    needUpdateOptions: UpdateFieldValueOptions<unknown>[],
    updatedInfo?: AITableRecordUpdatedInfo
) {
    const willHiddenRecordIds: string[] = [];
    const removeWillHiddenRecordIds: string[] = [];
    needUpdateOptions.forEach((option) => {
        const [recordId, fieldId] = option.path;
        let record = _.cloneDeep(aiTable.recordsMap()[recordId]);
        record.values[fieldId] = option.value;
        if (updatedInfo) {
            record = {
                ...record,
                ...updatedInfo
            };
        }
        const checkResult = checkConditions(aiTable, aiTable.fields() as AITableViewFields, record);
        if (checkResult) {
            removeWillHiddenRecordIds.push(recordId);
        } else {
            willHiddenRecordIds.push(recordId);
        }
    });
    aiTable.recordsWillHidden.update((value) => {
        value = value.filter((id) => !removeWillHiddenRecordIds.includes(id));
        value.push(...willHiddenRecordIds);
        return value;
    });
}

function updateWillMoveRecords(
    aiTable: AIViewTable,
    needUpdateOptions: UpdateFieldValueOptions<unknown>[],
    updatedInfo?: AITableRecordUpdatedInfo
) {
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    const groups = activeView.settings?.groups ?? [];
    const sorts = activeView.settings?.sorts ?? [];
    const sortFieldSet = new Set<string>();
    sorts.forEach((sort) => {
        sortFieldSet.add(sort.sort_by);
    });
    groups.forEach((group) => {
        sortFieldSet.add(group.field_id);
    });

    const updateRecordsMap = new Map<string, AITableRecord>();
    needUpdateOptions.forEach((option) => {
        const [recordId, fieldId] = option.path;
        if (sortFieldSet.has(fieldId)) {
            let record = updateRecordsMap.get(recordId) || _.cloneDeep(aiTable.recordsMap()[recordId]);
            record.values[fieldId] = option.value;
            if (updatedInfo) {
                record = {
                    ...record,
                    ...updatedInfo
                };
            }
            updateRecordsMap.set(recordId, record);
        }
    });
    if (updateRecordsMap.size === 0) {
        return;
    }
    const visibleRowsIndexMap = aiTable.context!.visibleRowsIndexMap();
    const tmpNewRecords = aiTable.gridData().records.map((record) => {
        const newRecord = updateRecordsMap.get(record._id);
        if (newRecord) {
            return newRecord;
        }
        return record;
    });

    const willMoveRecordMap = new Map<string, AITableRecord>();
    const allSorts = buildSorts(activeView);
    const tmpNewSortedRecords = sortRecordsByConditions(aiTable, tmpNewRecords as AITableViewRecord[], activeView, allSorts, {
        skipMoveRecordPosition: true
    });

    let originGroupLinearRows = aiTable.context!.linearRows();
    const recordsWillMoveMap = aiTable.recordsWillMove();
    if (recordsWillMoveMap.size > 0) {
        const tmpOriginRecords = aiTable.gridData().records.map((record) => {
            const originRecord = recordsWillMoveMap.get(record._id);
            if (originRecord) {
                return originRecord;
            }
            return record;
        });
        const tmpOriginSortedRecords = sortRecordsByConditions(aiTable, tmpOriginRecords as AITableViewRecord[], activeView, allSorts, {
            skipMoveRecordPosition: true
        });

        originGroupLinearRows =
            buildGroupLinearRows(aiTable, activeView, tmpOriginSortedRecords, { attachRecordsMap: recordsWillMoveMap }) ?? [];
    }

    const tmpNewGroupLinearRows = buildGroupLinearRows(aiTable, activeView, tmpNewSortedRecords) ?? [];

    updateRecordsMap.forEach((updateSortFieldRecord, recordId) => {
        const originalRecordIndex = visibleRowsIndexMap.get(recordId);
        const newRecordOfIndex = tmpNewGroupLinearRows[originalRecordIndex!];
        if (recordId !== newRecordOfIndex._id) {
            const originalRecord = aiTable.recordsWillMove().get(recordId) || aiTable.recordsMap()[recordId];
            willMoveRecordMap.set(recordId, originalRecord);
        } else {
            const originalParentLinearRowGroups = getParentLinearRowGroups(aiTable, recordId, originGroupLinearRows);
            const newParentLinearRowGroups = getParentLinearRowGroups(aiTable, recordId, tmpNewGroupLinearRows);
            if (
                _.join(_.map(originalParentLinearRowGroups, 'groupValue'), ':') !==
                _.join(_.map(newParentLinearRowGroups, 'groupValue'), ':')
            ) {
                const originalRecord = aiTable.recordsWillMove().get(recordId) || aiTable.recordsMap()[recordId];
                willMoveRecordMap.set(recordId, originalRecord);
            } else {
                willMoveRecordMap.delete(recordId);
            }
        }
    });
    aiTable.recordsWillMove.set(willMoveRecordMap);
}

export function updateFieldValues(aiTable: AIViewTable, options: UpdateFieldValueOptions[], updatedInfo?: AITableRecordUpdatedInfo) {
    const needUpdateOptions = options.filter((option) => {
        const oldValue = AITableQueries.getFieldValue(aiTable, option.path);
        return !_.isEqual(oldValue, option.value);
    });

    updateWillHiddenRecordIds(aiTable, needUpdateOptions, updatedInfo);
    updateWillMoveRecords(aiTable, needUpdateOptions, updatedInfo);
    Actions.updateFieldValues(aiTable, needUpdateOptions);

    if (updatedInfo) {
        const needUpdateSystemOptions: AITableSystemFieldValueOption[] = needUpdateOptions.map((option) => {
            return {
                path: [option.path[0]],
                updatedInfo: updatedInfo
            };
        });
        Actions.updateSystemFieldValues(aiTable, needUpdateSystemOptions);
    }
}
