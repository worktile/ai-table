import { AddOutlinedPath, AI_TABLE_ADD_FIELD_BUTTON_WIDTH, AI_TABLE_CELL_PADDING, AI_TABLE_ICON_COMMON_SIZE, Colors } from '../../constants';
import { Coordinate } from '../../core';
import Konva from 'konva/lib';
import { createIcon } from './create-icon';

export const createAddFieldColumn = (instance: Coordinate, columnLength: number, columnStopIndex: number) => {
    if (columnStopIndex !== columnLength - 1) return;
    const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
    const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
    const x = lastColumnOffset + lastColumnWidth;
    const btnWidth = AI_TABLE_ADD_FIELD_BUTTON_WIDTH;
    const offsetY = (instance.rowInitSize - AI_TABLE_ICON_COMMON_SIZE) / 2;
    const btnGroup = new Konva.Group({ x });
    const react = new Konva.Rect({
        x: 0.5,
        y: 0.5,
        width: instance.containerWidth - x < btnWidth ? btnWidth : instance.containerWidth - x,
        height: instance.rowInitSize,
        stroke: Colors.gray200,
        strokeWidth: 1,
        listening: true
    });
    const addIcon = createIcon({
        x: AI_TABLE_CELL_PADDING,
        y: offsetY,
        data: AddOutlinedPath,
        fill: Colors.gray600,
        listening: false
    });
    btnGroup.add(react);
    btnGroup.add(addIcon);
    return btnGroup;
};
