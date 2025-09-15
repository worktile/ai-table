import { AITableFieldType, AITableView, AITableViewRecords, AITableViewRecord, AITableSort } from '@ai-table/utils';
import { AITable, AITableQueries, FieldModelMap } from '@ai-table/grid';

export function sortRecordsByConditions(
    aiTable: AITable,
    records: AITableViewRecords,
    activeView: AITableView,
    sorts: AITableSort[],
    sortKeysMap?: Partial<Record<AITableFieldType, string>>
) {
    const shallowRecords = [...records];

    return shallowRecords.sort((record1, record2) => {
        if (sorts.length) {
            const sortsCompareResult = compareBySorts(record1, record2, sorts, aiTable, sortKeysMap);
            if (sortsCompareResult !== 0) {
                return sortsCompareResult;
            }
        }

        return compareByPosition(record1, record2, activeView);
    });
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
