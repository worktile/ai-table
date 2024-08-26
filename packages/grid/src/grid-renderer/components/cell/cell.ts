import { AITableFieldType } from '../../../core';
import { AITableCell, AITableCellOptions } from '../../../types/cell';

export const Cell = (options: AITableCell) => {
    const { x, y, rowHeight, columnWidth, field, recordId, isActive, style, renderData, cellValue } = options;

    const cellOptions: AITableCellOptions = {
        field,
        recordId,
        isActive,
        x,
        y,
        rowHeight,
        columnWidth,
        style,
        renderData,
        cellValue
    };

    switch (field.type) {
        case AITableFieldType.text:
            return CellText(cellOptions);
        default:
            return null;
    }
};
