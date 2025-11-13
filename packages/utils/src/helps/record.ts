import { AITable } from '@ai-table/grid';

export function nextRecord(aiTable: AITable): string | null {
    const records = aiTable.gridData().records;
    const visibleRowsIndexMap = aiTable.context!.visibleRowsIndexMap()!;
    const currentId = aiTable.selection().activeCell?.[0];

    if (!currentId) return null;

    const currentIndex = visibleRowsIndexMap.get(currentId) || 0;
    if (currentIndex === -1 || currentIndex === records.length - 1) {
        return null;
    }

    const nextId = records[currentIndex + 1]._id;
    return nextId;
}

export function previousRecord(aiTable: AITable): string | null {
    const records = aiTable.gridData().records;
    const visibleRowsIndexMap = aiTable.context!.visibleRowsIndexMap()!;
    const currentId = aiTable.selection().activeCell?.[0];

    if (!currentId) return null;

    const currentIndex = visibleRowsIndexMap.get(currentId) || 0;
    if (currentIndex <= 0) {
        return null;
    }

    const prevId = records[currentIndex - 1]._id;
    return prevId;
}

export function getRecordNavigationInfo(aiTable: AITable, recordId: string) {
    const records = aiTable.gridData().records;
    const visibleRowsIndexMap = aiTable.context!.visibleRowsIndexMap()!;
    const index = visibleRowsIndexMap.get(recordId) || 0;

    if (index === -1) return null;

    return {
        index,
        total: records.length,
        hasPrevious: index > 0,
        hasNext: index < records.length - 1,
        previousId: index > 0 ? records[index - 1]._id : null,
        nextId: index < records.length - 1 ? records[index + 1]._id : null
    };
}
