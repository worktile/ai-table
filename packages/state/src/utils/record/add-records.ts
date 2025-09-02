import { AITableLinearRowGroup, closeExpendCell, getDefaultFieldValue, idsCreator, setSelection, shortIdsCreator } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import { getSortFields } from '../field/sort-fields';
import { Actions } from '../../action';
import { checkConditions, getDefaultRecordDataByFilter } from './filter';
import { AddRecordOptions, AITableRecord, AITableViewFields, AITableViewRecords, FieldValue, TrackableEntity } from '@ai-table/utils';
import { getParentLinearRowGroups } from '../group/utils';
import { getMaxPosition } from '../view';

export function addRecords(aiTable: AIViewTable, trackableEntity: TrackableEntity, options?: AddRecordOptions) {
    options = options || {};
    const newRecords: AITableRecord[] = [];
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.viewsMap()[activeViewId];
    const groups = activeView.settings?.groups;
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
    let needCopyGroupValuesMap: Record<string, any> | null = null;
    if (groups?.length && options.forGroupId) {
        const parentGroups = getParentLinearRowGroups(aiTable, options.forGroupId);
        needCopyGroupValuesMap = parentGroups.reduce(
            (pre, cur) => {
                pre[cur.fieldId] = cur.groupValue;
                return pre;
            },
            {} as Record<string, any>
        );
    }
    const records = aiTable.gridData().records as AITableViewRecords;
    newRecordIds.forEach((id, index) => {
        const record = {
            _id: id,
            short_id: newRecordShortIds[index],
            values: newRecordValues,
            ...trackableEntity,
            positions: {
                [activeViewId]: getMaxPosition(records, activeViewId) + 1
            }
        };
        if (needCopyGroupValuesMap) {
            groups?.forEach((group) => {
                // 复制分组字段值
                record.values[group.field_id] = needCopyGroupValuesMap[group.field_id];
            });
        }
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
    Actions.addRecords(aiTable, newRecords, options);
    const recentAddRecord = options.isInsertBefore ? newRecords[newRecords.length - 1] : newRecords[0];
    const activeRecordId = recentAddRecord._id;
    const activeFieldId = aiTable.gridData().fields[0]._id;
    closeExpendCell(aiTable);
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
