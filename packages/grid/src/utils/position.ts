import { AI_TABLE_BLANK, AI_TABLE_ROW_HEAD_WIDTH } from '../constants';
import { AITableAreaType } from '../types';
import { AITableField, Context, Coordinate } from '../core';
import { scrollMax } from './visible-range';
import { getTargetName } from './common';

export const getMousePosition = (
    x: number,
    y: number,
    instance: Coordinate,
    fields: AITableField[],
    context: Context,
    _targetName?: string
) => {
    const { scrollTop, scrollLeft } = context.scrollState();
    const { scrollMaxWidth, scrollMaxHeight } = scrollMax(instance, fields);
    const offsetTop = scrollTop + y;
    const rowIndex = instance.getRowStartIndex(offsetTop);
    const offsetLeft = isWithinFrozenColumnBoundary(x, instance.frozenColumnWidth) ? x : scrollLeft + x;
    const columnIndex = instance.getColumnStartIndex(offsetLeft);
    const areaType = offsetLeft <= scrollMaxWidth && offsetTop <= scrollMaxHeight ? AITableAreaType.grid : AITableAreaType.none;
    const realAreaType = areaType;
    const targetName = getTargetName(_targetName);
    return {
        areaType,
        realAreaType,
        targetName, // As a simple operational identifier, with prefix name only
        realTargetName: _targetName || AI_TABLE_BLANK, // Real name
        rowIndex,
        columnIndex,
        offsetTop,
        offsetLeft,
        x: x,
        y
    };
};

export const isWithinFrozenColumnBoundary = (x: number, frozenColumnWidth: number) => {
    const max = AI_TABLE_ROW_HEAD_WIDTH + frozenColumnWidth;
    const min = AI_TABLE_ROW_HEAD_WIDTH;
    return x > min && x < max;
};
