import { AI_TABLE_BLANK, AI_TABLE_CELL_ACTIVE_BORDER_WIDTH, AI_TABLE_OFFSET } from '../constants';
import { AITable, Coordinate, RendererContext } from '../core';
import { AITableAreaType } from '../types';
import { getTargetName } from './common';
import { scrollMax } from './visible-range';
import { AITableField } from '@ai-table/utils';

export const getMousePosition = (
    aiTable: AITable,
    x: number,
    y: number,
    coordinate: Coordinate,
    fields: AITableField[],
    context: RendererContext,
    _targetName?: string
) => {
    const { scrollTop, scrollLeft } = context.scrollState();
    const { scrollMaxWidth, scrollMaxHeight } = scrollMax(aiTable, coordinate, fields);
    const offsetTop = scrollTop + y;
    const rowIndex = coordinate.getRowStartIndex(offsetTop);
    const offsetLeft = isWithinFrozenColumnBoundary(x, coordinate.frozenColumnWidth, context.rowHeadWidth()) ? x : scrollLeft + x;
    const columnIndex = coordinate.getColumnStartIndex(offsetLeft);
    const areaType = offsetLeft <= scrollMaxWidth && offsetTop <= scrollMaxHeight ? AITableAreaType.grid : AITableAreaType.none;
    const targetName = getTargetName(_targetName);
    return {
        areaType,
        targetName, // As a simple operational identifier, with prefix name only
        realTargetName: _targetName || AI_TABLE_BLANK, // Real name
        rowIndex,
        columnIndex,
        offsetTop,
        offsetLeft,
        x,
        y
    };
};

export const isWithinFrozenColumnBoundary = (x: number, frozenColumnWidth: number, rowHeadWidth: number) => {
    const max = rowHeadWidth + frozenColumnWidth;
    const min = rowHeadWidth;
    return x > min && x < max;
};

export const getEditorSpace = (widthOrHeight: number) => {
    return widthOrHeight + AI_TABLE_OFFSET * 2;
};

export const getEditorBoxOffset = () => {
    return -AI_TABLE_OFFSET;
};

export const getCellEditorBorderSpace = () => {
    return AI_TABLE_CELL_ACTIVE_BORDER_WIDTH * 2 - AI_TABLE_OFFSET * 2;
};

export const getHoverEditorSpace = (widthOrHeight: number) => {
    const borderSpace = getCellEditorBorderSpace();
    return widthOrHeight - borderSpace;
};

export const getHoverEditorBoxOffset = () => {
    const borderSpace = getCellEditorBorderSpace();
    return borderSpace / 2;
};
