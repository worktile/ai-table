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
            selectedRecords: new Set(aiTable.records().map((item) => item._id))
        });
    } else {
        clearSelection(aiTable);
    }
}
