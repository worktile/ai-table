import { AI_TABLE_BLANK, AI_TABLE_CELL_ACTIVE_BORDER_WIDTH, AI_TABLE_OFFSET, AI_TABLE_ROW_HEAD_WIDTH } from '../constants';
import { AITableField, Coordinate, RendererContext } from '../core';
import { AITableAreaType } from '../types';
import { getTargetName } from './common';
import { scrollMax } from './visible-range';

export const getMousePosition = (
    x: number,
    y: number,
    coordinate: Coordinate,
    fields: AITableField[],
    context: RendererContext,
    _targetName?: string
) => {
    const { scrollTop, scrollLeft } = context.scrollState();
    const { scrollMaxWidth, scrollMaxHeight } = scrollMax(coordinate, fields);
    const offsetTop = scrollTop + y;
    const rowIndex = coordinate.getRowStartIndex(offsetTop);
    const offsetLeft = isWithinFrozenColumnBoundary(x, coordinate.frozenColumnWidth) ? x : scrollLeft + x;
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

export const isWithinFrozenColumnBoundary = (x: number, frozenColumnWidth: number) => {
    const max = AI_TABLE_ROW_HEAD_WIDTH + frozenColumnWidth;
    const min = AI_TABLE_ROW_HEAD_WIDTH;
    return x > min && x < max;
};

export const getCellEditorBorderSpace = () => {
    return AI_TABLE_CELL_ACTIVE_BORDER_WIDTH * 2 - AI_TABLE_OFFSET * 2;
};

export const getEditorSpace = (widthOrHeight: number) => {
    const borderSpace = getCellEditorBorderSpace();
    return widthOrHeight - borderSpace;
};

export const getEditorBoxOffset = () => {
    const borderSpace = getCellEditorBorderSpace();
    return borderSpace / 2;
};
