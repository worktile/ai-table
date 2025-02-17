import { AI_TABLE_CELL_PADDING, AI_TABLE_OFFSET, DEFAULT_TEXT_ALIGN_LEFT, DEFAULT_TEXT_ALIGN_RIGHT } from '../constants';
import { AITableQueries } from '../core';
import { isSelectedField } from '../renderer';
import { AITableCellsConfig, AITableHoverCellConfig, AITableRowType } from '../types';
import { getCellHorizontalPosition, transformCellValue } from './cell';
import { getDetailByTargetName } from './common';

export function getHoverCellConfig(options: AITableCellsConfig) {
    const { aiTable, coordinate, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = options;
    const pointPosition = aiTable.context!.pointPosition();
    const { rowHeight, columnCount, rowCount } = coordinate;
    const { targetName, fieldId, recordId } = getDetailByTargetName(pointPosition.realTargetName!);
    if (!recordId || !fieldId) {
        return;
    }
    const field = aiTable.fieldsMap()[fieldId];
    const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, fieldId]);
    const transformValue = transformCellValue(aiTable, field, cellValue) || {};
    if (Object.keys(transformValue).length === 0) {
        return;
    }
    const columnIndex = pointPosition.columnIndex;
    const rowIndex = pointPosition.rowIndex;

    const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
    const columnWidth = coordinate.getColumnWidth(columnIndex);
    const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
    const { width, offset } = getCellHorizontalPosition({
        columnWidth,
        columnIndex,
        columnCount
    });

    const style = {
        // fontWeight: DEFAULT_FONT_STYLE,
        textAlign: DEFAULT_TEXT_ALIGN_LEFT
    } as any;
    const textAlign = style.textAlign;
    // const fontWeight = style.fontWeight;
    const renderX =
        textAlign === DEFAULT_TEXT_ALIGN_RIGHT
            ? columnWidth - AI_TABLE_CELL_PADDING + AI_TABLE_OFFSET
            : AI_TABLE_CELL_PADDING + AI_TABLE_OFFSET;
    const renderY = 0 - AI_TABLE_OFFSET * 2;

    const result: AITableHoverCellConfig = {
        field,
        aiTable,
        coordinate,
        x,
        y,
        render: {
            aiTable,
            recordId,
            field,
            isActive: isSelectedField(fieldId, aiTable),
            x: renderX,
            y: renderY,
            columnWidth: width,
            rowHeight,
            cellValue,
            transformValue,
            style,
            zIndex: 2
        }
    };

    return result;
}
