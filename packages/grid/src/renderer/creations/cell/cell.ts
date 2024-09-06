import { AITableFieldType } from '../../../core';
import { AITableCellOptions } from '../../../types';
import { createCellText } from './text';

export const createCell = (config: AITableCellOptions) => {
    const { aiTable, context, x, y, rowHeight, columnWidth, field, recordId, isActive, style, cellValue, renderData } = config;

    const cellOptions: AITableCellOptions = {
        aiTable,
        context,
        field,
        recordId,
        isActive,
        x,
        y,
        rowHeight,
        columnWidth,
        style,
        cellValue,
        renderData
    };

    switch (field.type) {
        case AITableFieldType.text:
            return createCellText(cellOptions);
    }
    return null;
};
