import { clearSelection, setSelection } from './cell';
import { AITable } from './field';

export function toggleSelectRecord(aiTable: AITable, recordId: string) {
    if (aiTable.selection().selectedRecords.has(recordId)) {
        aiTable.selection().selectedRecords.delete(recordId);
    } else {
        aiTable.selection().selectedRecords.add(recordId);
    }
    const selectedRecords = aiTable.selection().selectedRecords;
    aiTable.selection.set({
        selectedRecords: selectedRecords,
        selectedFields: new Set(),
        selectedCells: new Set(),
        activeCell: null,
        selectedEndCell: null
    });
}

export function toggleSelectAllRecords(aiTable: AITable, checked: boolean) {
    if (checked) {
        setSelection(aiTable, {
            selectedRecords: new Set(aiTable.gridData().records.map((item) => item._id))
        });
    } else {
        clearSelection(aiTable);
    }
}

export function getNextRecordByActiveCell(aiTable: AITable): string | null {
    const records = aiTable.gridData().records;
    const currentId = aiTable.selection().activeCell?.[0];
    if (!currentId) return null;
    const currentIndex = records.findIndex((item) => item._id === currentId);
    if (currentIndex === -1 || currentIndex === records.length - 1) {
        return null;
    }

    const nextId = records[currentIndex + 1]._id;
    return nextId;
}

export function getPreviousRecordByActiveCell(aiTable: AITable): string | null {
    const records = aiTable.gridData().records;
    const currentId = aiTable.selection().activeCell?.[0];
    if (!currentId) return null;
    const currentIndex = records.findIndex((item) => item._id === currentId);
    if (currentIndex <= 0) {
        return null;
    }

    const prevId = records[currentIndex - 1]._id;
    return prevId;
}

export function getRecordNavigationInfo(aiTable: AITable, recordId: string) {
    const records = aiTable.gridData().records;
    const index = records.findIndex((item) => item._id === recordId);
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
