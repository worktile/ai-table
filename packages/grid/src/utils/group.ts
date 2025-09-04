import { AITableRowType } from '../types';
import { AITable } from './field';

export function getGroupLastRecordIndex(aiTable: AITable, startRowIndex: number) {
    const linearRows = aiTable.context!.linearRows();
    if (startRowIndex + 1 >= linearRows.length) {
        return startRowIndex;
    }

    for (let i = startRowIndex + 1; i < linearRows.length; i++) {
        const row = linearRows[i];
        if (row.type !== AITableRowType.record) {
            return i - 1;
        }
    }
    return linearRows.length - 1;
}
