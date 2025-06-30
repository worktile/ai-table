import { AIRecordFieldIdPath, UpdateFieldValueOptions } from '@ai-table/utils';
import { AITable } from '../../core';
import { AITableActions } from '../../utils';

export interface AITableDragFillState {
    isDragging: boolean;
    sourceCells: Set<string>;
    direction?: 'downward' | 'upward';
}

export function dragFillSelectArea(aiTable: AITable, sourceCells: Set<string>, currentRecordId: string) {
    let dragFillStartCell: AIRecordFieldIdPath;
    let dragFillEndCell: AIRecordFieldIdPath;

    const { firstCell, lastCell } = getFillAreaBounds(sourceCells);

    const currentRowIndex = aiTable.context!.visibleRowsIndexMap().get(currentRecordId)!;
    const firstRowIndex = aiTable.context!.visibleRowsIndexMap().get(firstCell[0])!;
    const lastRowIndex = aiTable.context!.visibleRowsIndexMap().get(lastCell[0])!;

    let direction: 'downward' | 'upward' | undefined = undefined;
    if (currentRowIndex < firstRowIndex) {
        direction = 'upward';
    } else if (currentRowIndex > lastRowIndex) {
        direction = 'downward';
    }

    const firstCellRecordId = firstCell[0];
    const firstCellFieldId = firstCell[1];
    const lastCellRecordId = lastCell[0];
    const lastCellFieldId = lastCell[1];

    if (direction === 'downward') {
        dragFillStartCell = [firstCellRecordId, firstCellFieldId];
        dragFillEndCell = [currentRecordId, lastCellFieldId];
    } else if (direction === 'upward') {
        dragFillStartCell = [currentRecordId, firstCellFieldId];
        dragFillEndCell = [lastCellRecordId, lastCellFieldId];
    } else {
        dragFillStartCell = firstCell;
        dragFillEndCell = lastCell;
    }

    return { dragFillStartCell, dragFillEndCell, direction };
}

export function performFill(aiTable: AITable, dragFillState: AITableDragFillState, actions: AITableActions) {
    const selectedCells: string[] = Array.from(aiTable.selection().selectedCells);
    const { sourceCells, direction } = dragFillState;
    if (sourceCells.size === 0 || selectedCells.length === 0) {
        return;
    }

    const { firstCell: sourceStartCell, lastCell: sourceEndCell } = getFillAreaBounds(sourceCells);
    const visibleRowsIndexMap = aiTable.context!.visibleRowsIndexMap();
    const sourceStartRowIndex = visibleRowsIndexMap.get(sourceStartCell[0])!;
    const sourceEndRowIndex = visibleRowsIndexMap.get(sourceEndCell[0])!;

    const selectedEndCell = selectedCells[selectedCells.length - 1].split(':');
    const selectedEndRowIndex = visibleRowsIndexMap.get(selectedEndCell[0])!;

    let targetStartRowIndex: number;
    let targetEndRowIndex: number;

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

export function getFillAreaBounds(selectedCells: Set<string>): { firstCell: AIRecordFieldIdPath; lastCell: AIRecordFieldIdPath } {
    let firstCell: AIRecordFieldIdPath;
    let lastCell: AIRecordFieldIdPath;

    const selectedCellsArray = Array.from(selectedCells);
    const startCell = selectedCellsArray[0].split(':');
    const endCell = selectedCellsArray[selectedCellsArray.length - 1].split(':');
    firstCell = [startCell[0], startCell[1]];
    lastCell = [endCell[0], endCell[1]];

    return { firstCell, lastCell };
}
