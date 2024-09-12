import Konva from 'konva/lib';
import {
    AddOutlinedPath,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    Colors
} from '../../constants';
import { AITableField, Coordinate } from '../../core';
import { generateTargetName } from '../../utils';
import { createIcon } from './create-icon';

export const createAddFieldColumn = (coordinate: Coordinate, fields: AITableField[], columnStopIndex: number) => {
    const columnLength = fields.length;
    if (columnStopIndex !== columnLength - 1) return;
    const lastColumnOffset = coordinate.getColumnOffset(columnStopIndex);
    const lastColumnWidth = coordinate.getColumnWidth(columnStopIndex);
    const x = lastColumnOffset + lastColumnWidth;
    const btnWidth = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
    const offsetY = (coordinate.rowInitSize - AI_TABLE_ICON_COMMON_SIZE) / 2;
    const btnGroup = new Konva.Group({ x });
    const react = new Konva.Rect({
        name: generateTargetName({ targetName: AI_TABLE_FIELD_ADD_BUTTON, fieldId: fields[columnStopIndex]._id, mouseStyle: 'pointer' }),
        x: AI_TABLE_OFFSET,
        y: AI_TABLE_OFFSET,
        width: coordinate.containerWidth - x < btnWidth ? btnWidth : coordinate.containerWidth - x,
        height: coordinate.rowInitSize,
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
