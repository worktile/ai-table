import { AIRecordFieldIdPath, UpdateFieldValueOptions } from '@ai-table/utils';
import { AITable } from '../../core';
import { AITableActions } from '../../utils';

export interface AITableDragFillState {
    isDragging: boolean;
    activeCell: AIRecordFieldIdPath | null;
    sourceCells: Set<string>;
}

export function getFillDirection(aiTable: AITable, sourceCells: Set<string>, mouseUpRecordId: string) {
    const { startCell: sourceStartCell, endCell: sourceEndCell } = getStartAndEndCell(sourceCells);
    const currentRowIndex = aiTable.context!.visibleRowsIndexMap().get(mouseUpRecordId)!;
    const sourceStartRowIndex = aiTable.context!.visibleRowsIndexMap().get(sourceStartCell[0])!;
    const sourceEndRowIndex = aiTable.context!.visibleRowsIndexMap().get(sourceEndCell[0])!;

    if (currentRowIndex < sourceStartRowIndex) {
        return 'upward';
    } else if (currentRowIndex > sourceEndRowIndex) {
        return 'downward';
    } else {
        return undefined;
    }
}

export function dragFillHighlightArea(aiTable: AITable, sourceCells: Set<string>, currentRecordId: string) {
    const { startCell: sourceStartCell, endCell: sourceEndCell } = getStartAndEndCell(sourceCells);
    const direction = getFillDirection(aiTable, sourceCells, currentRecordId);
    const sourceStartCellFieldId = sourceStartCell[1];
    const sourceEndCellFieldId = sourceEndCell[1];

    let highlightStartCell: AIRecordFieldIdPath;
    let highlightEndCell: AIRecordFieldIdPath;

    if (direction === 'downward') {
        highlightStartCell = sourceStartCell;
        highlightEndCell = [currentRecordId, sourceEndCellFieldId];
    } else if (direction === 'upward') {
        highlightStartCell = [currentRecordId, sourceStartCellFieldId];
        highlightEndCell = sourceEndCell;
    } else {
        highlightStartCell = sourceStartCell;
        highlightEndCell = sourceEndCell;
    }

    return { highlightStartCell, highlightEndCell };
}

export function performFill(aiTable: AITable, sourceCells: Set<string>, mouseUpRecordId: string, actions: AITableActions) {
    const selectedCells: string[] = Array.from(aiTable.selection().selectedCells);

    if (sourceCells.size === 0 || selectedCells.length === 0) {
        return;
    }

    const { startCell: sourceStartCell, endCell: sourceEndCell } = getStartAndEndCell(sourceCells);
    const visibleRowsIndexMap = aiTable.context!.visibleRowsIndexMap();
    const sourceStartRowIndex = visibleRowsIndexMap.get(sourceStartCell[0])!;
    const sourceEndRowIndex = visibleRowsIndexMap.get(sourceEndCell[0])!;

    const selectedEndCell = selectedCells[selectedCells.length - 1].split(':');
    const selectedEndRowIndex = visibleRowsIndexMap.get(selectedEndCell[0])!;

    let targetStartRowIndex: number;
    let targetEndRowIndex: number;
    const direction = getFillDirection(aiTable, sourceCells, mouseUpRecordId);

    if (direction === 'downward') {
        targetStartRowIndex = sourceEndRowIndex + 1;
        targetEndRowIndex = selectedEndRowIndex;
    } else {
        const selectedFirstCell = selectedCells[0].split(':');
        const selectedFirstRowIndex = visibleRowsIndexMap.get(selectedFirstCell[0])!;
        targetStartRowIndex = selectedFirstRowIndex;
        targetEndRowIndex = sourceStartRowIndex - 1;
    }

    const sourceRowCount = sourceEndRowIndex - sourceStartRowIndex + 1;
    const sourceRows: string[] = [];
    const linearRows = aiTable.context!.linearRows();
    for (let i = sourceStartRowIndex; i <= sourceEndRowIndex; i++) {
        sourceRows.push(linearRows[i]._id);
    }

    const updateData: UpdateFieldValueOptions[] = [];

    const fields = AITable.getVisibleFields(aiTable);
    const visibleColumnsIndexMap = aiTable.context!.visibleColumnsIndexMap();
    const recordsMap = aiTable.recordsMap();

    const startFieldIndex = visibleColumnsIndexMap.get(sourceStartCell[1])!;
    const endFieldIndex = visibleColumnsIndexMap.get(sourceEndCell[1])!;

    for (let index = startFieldIndex; index <= endFieldIndex; index++) {
        const fieldId = fields[index]._id;

        for (let rowIndex = targetStartRowIndex; rowIndex <= targetEndRowIndex; rowIndex++) {
            const targetRecordId = linearRows[rowIndex]._id;

            const relativeRowIndex = direction === 'downward' ? rowIndex - targetStartRowIndex : targetEndRowIndex - rowIndex;
            const mod = relativeRowIndex % sourceRowCount;
            const sourceRowIndex = direction === 'downward' ? mod : sourceRowCount - 1 - mod;
            const sourceRecordId = sourceRows[sourceRowIndex];
            const sourceValue = recordsMap[sourceRecordId]?.values[fieldId];

            updateData.push({
                path: [targetRecordId, fieldId],
                value: sourceValue
            });
        }
    }

    if (updateData.length > 0) {
        actions.updateFieldValues(updateData);
    }
}

export function getStartAndEndCell(selectedCells: Set<string>): {
    startCell: AIRecordFieldIdPath;
    endCell: AIRecordFieldIdPath;
} {
    const selectedCellsArray = Array.from(selectedCells);
    const firstCell = selectedCellsArray[0].split(':');
    const lastCell = selectedCellsArray[selectedCellsArray.length - 1].split(':');
    const startCell = [firstCell[0], firstCell[1]] as AIRecordFieldIdPath;
    const endCell = [lastCell[0], lastCell[1]] as AIRecordFieldIdPath;
    return { startCell, endCell };
}
