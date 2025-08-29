import { AITableRowType } from '../types';
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

export function getGridDataRecordIndexByLinearRowIndex(aiTable: AITable, targetRowIndex: number) {
    const linearRows = aiTable.context!.linearRows();
    const records = aiTable.gridData().records;
    const linearRowRecord = linearRows[targetRowIndex];
    if (linearRowRecord.type === AITableRowType.record) {
        return records.findIndex((record) => record._id === linearRowRecord._id);
    }
    if (linearRowRecord.type === AITableRowType.add) {
        return linearRowRecord.range ? linearRowRecord.range[1] + 1 : targetRowIndex;
    }
    return targetRowIndex;
}
