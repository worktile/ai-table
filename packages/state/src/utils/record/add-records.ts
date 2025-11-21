import { closeExpendCell, FieldModelMap, idsCreator, setSelection, shortIdCreator, shortIdsCreator } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import { getSortFields } from '../field/sort-fields';
import { Actions } from '../../action';
import { checkConditions, getDefaultRecordDataByFilter } from './filter';
import {
    AddRecordOptions,
    AITableRecord,
    AITableViewFields,
    FieldValue,
    AITableRecordCreatedInfo,
    CopyRecordOptions,
    idCreator
} from '@ai-table/utils';
import { getParentGroupValuesByGroupId, getPrevRecordIdByAddGroupId } from './common';

export function addRecords(aiTable: AIViewTable, options: AddRecordOptions, recordCreatedInfo: AITableRecordCreatedInfo) {
    options = options || {};
    const newRecords: AITableRecord[] = [];
    const activeViewId = aiTable.activeViewId?.();
    const activeView = aiTable.viewsMap?.()?.[activeViewId];
    const groups = activeView?.settings?.groups;
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
        if (!options.afterRecordId && !options.beforeRecordId) {
            const prevRecordId = getPrevRecordIdByAddGroupId(aiTable, options.forGroupId);
            if (prevRecordId) {
                options.afterRecordId = prevRecordId;
            }
        }
        needCopyGroupValuesMap = getParentGroupValuesByGroupId(aiTable, options.forGroupId);
    }
    newRecordIds.forEach((id, index) => {
        const record = {
            _id: id,
            short_id: newRecordShortIds[index],
            values: newRecordValues,
            ...recordCreatedInfo
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
    const recentAddRecord = options.beforeRecordId ? newRecords[newRecords.length - 1] : newRecords[0];
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

export function copyRecords(aiTable: AIViewTable, options: CopyRecordOptions, recordCreatedInfo: AITableRecordCreatedInfo) {
    const newRecords: AITableRecord[] = [];
    (options.recordIds || []).forEach((recordId) => {
        const record = aiTable.recordsMap()[recordId];

        if (record) {
            newRecords.push({
                ...record,
                ...recordCreatedInfo,
                _id: idCreator(),
                short_id: shortIdCreator()
            });
        }
    });
    Actions.addRecords(aiTable, newRecords, options);
    const recentAddRecord = newRecords[0];
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
        let fields = aiTable.fields() as AITableViewFields;

        const activeView = aiTable.viewsMap?.()?.[aiTable.activeViewId?.()];
        if (activeView) {
            fields = getSortFields(aiTable, fields, activeView);
        }

        fields.map((field) => {
            const defaultValue = FieldModelMap[field.type].getDefaultValue();
            newRecordValues[field._id] = defaultValue;
        });

        if (activeView) {
            const { conditions, condition_logical } = activeView.settings || {};
            if (conditions && conditions.length) {
                newRecordValues = getDefaultRecordDataByFilter(newRecordValues, conditions, fields, condition_logical);
            }
        }
    }
    return newRecordValues;
}
