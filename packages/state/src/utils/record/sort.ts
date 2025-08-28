import { AITableFieldType, AITableView, AITableViewRecords, AITableViewRecord, AITableGroupField, SortDirection } from '@ai-table/utils';
import { AITable, AITableQueries, FieldModelMap } from '@ai-table/grid';

export function getSortRecords(
    aiTable: AITable,
    records: AITableViewRecords,
    activeView: AITableView,
    sortKeysMap?: Partial<Record<AITableFieldType, string>>
) {
    const shallowRecords = [...records];
    const groups = activeView.settings?.groups;

    return shallowRecords.sort((record1, record2) => {
        // 分组排序（高优先级）
        if (groups && groups.length > 0) {
            const groupCompareResult = compareByGroups(aiTable, record1, record2, groups);
            if (groupCompareResult !== 0) {
                return groupCompareResult;
            }
        }

        // sorts排序（中优先级）
        let shouldSkipPositionSort = false;
        if (activeView.settings?.sorts?.length) {
            const { is_keep_sort, sorts } = activeView.settings;
            if (sorts?.length) {
                const sortsCompareResult = compareBySorts(record1, record2, sorts, aiTable, sortKeysMap);
                if (sortsCompareResult !== 0) {
                    return sortsCompareResult;
                }
                shouldSkipPositionSort = Boolean(is_keep_sort);
            }
        }

        // position排序（低优先级）
        if (shouldSkipPositionSort) {
            // is_keep_sort为true，禁用position排序
            return 0;
        }
        return compareByPosition(record1, record2, activeView);
    });
}

export function sortRecordsBySortInfo(
    aiTable: AITable,
    records: AITableViewRecords,
    activeView: AITableView,
    sortKeysMap?: Partial<Record<AITableFieldType | string, string>>
) {
    const shallowRows = [...records];
    if (activeView.settings?.sorts?.length) {
        shallowRows.sort((prev, current) => {
            return activeView.settings!.sorts!.reduce((acc, rule) => {
                const field = aiTable.fieldsMap()[rule.sort_by];
                if (!field || acc !== 0) {
                    return acc;
                }
                const fieldMethod = FieldModelMap[field.type];
                const sortKey = sortKeysMap?.[field.type];

                const cellValue1 = AITableQueries.getFieldValue(aiTable, [prev._id, field._id]);
                const cellValue2 = AITableQueries.getFieldValue(aiTable, [current._id, field._id]);
                const references = aiTable.context!.references();
                const res = fieldMethod.compare(cellValue1, cellValue2, references, sortKey, {
                    aiTable,
                    field
                });
                return res * rule.direction;
            }, 0);
        });
        return shallowRows;
    }
    return shallowRows;
}

function compareByGroups(aiTable: AITable, record1: AITableViewRecord, record2: AITableViewRecord, groups: AITableGroupField[]): number {
    return groups.reduce((result, groupField) => {
        if (result !== 0) return result;

        const field = aiTable.fieldsMap()[groupField.field_id];
        if (!field) return 0;

        const value1 = AITableQueries.getFieldValue(aiTable, [record1._id, field._id]);
        const value2 = AITableQueries.getFieldValue(aiTable, [record2._id, field._id]);

        const fieldModel = FieldModelMap[field.type];
        if (!fieldModel) return 0;

        const compareResult = fieldModel.compare(value1, value2, aiTable.context!.references(), undefined, {
            aiTable,
            field
        });

        return compareResult * (groupField.direction === SortDirection.ascending ? 1 : -1);
    }, 0);
}

function compareBySorts(
    record1: AITableViewRecord,
    record2: AITableViewRecord,
    sorts: any[],
    aiTable: AITable,
    sortKeysMap?: Partial<Record<AITableFieldType | string, string>>
): number {
    return sorts.reduce((acc, rule) => {
        const field = aiTable.fieldsMap()[rule.sort_by];
        if (!field || acc !== 0) {
            return acc;
        }
        const fieldMethod = FieldModelMap[field.type];
        const sortKey = sortKeysMap?.[field.type];

        const cellValue1 = AITableQueries.getFieldValue(aiTable, [record1._id, field._id]);
        const cellValue2 = AITableQueries.getFieldValue(aiTable, [record2._id, field._id]);
        const references = aiTable.context!.references();
        const res = fieldMethod.compare(cellValue1, cellValue2, references, sortKey, {
            aiTable,
            field
        });
        return res * rule.direction;
    }, 0);
}

function compareByPosition(record1: AITableViewRecord, record2: AITableViewRecord, activeView: AITableView): number {
    const hasPosition1 = record1.positions && record1.positions[activeView._id] !== undefined;
    const hasPosition2 = record2.positions && record2.positions[activeView._id] !== undefined;

    if (hasPosition1 && hasPosition2) {
        return record1.positions[activeView._id] - record2.positions[activeView._id];
    }

    // 如果只有一个有位置信息，有位置的排在前面
    if (hasPosition1 && !hasPosition2) {
        return -1;
    }
    if (!hasPosition1 && hasPosition2) {
        return 1;
    }

    // 如果都没有位置信息，保持原有顺序
    return 0;
}
