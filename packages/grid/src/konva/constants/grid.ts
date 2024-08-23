import { GRID_BLANK } from './config';

export const GRID_FIELD_HEAD_HEIGHT = 40; // Height of field header
export const GRID_ROW_HEAD_WIDTH = 70; // Row head width

/**
 * Layout
 */
export const GRID_GROUP_OFFSET = 16; // Group Indent
export const GRID_FILL_HANDLER_SIZE = 8; // Width and height of the fill handler
export const GRID_BOTTOM_STAT_HEIGHT = 39; // Height of the bottom statistics column
export const GRID_ADD_FIELD_BUTTON_WIDTH = 100; // The width of the column add button when there is no grouping

/**
 * CellValue
 */
export const GRID_ICON_COMMON_SIZE = 16; // Size of common icons
export const GRID_ICON_SMALL_SIZE = 12; // Size of small icons
export const GRID_CELL_VALUE_PADDING = 10; // inner padding of cell
export const GRID_CELL_ABBR_MIN_WIDTH = 20; // Minimum width of time zone abbr

// field head icon
export const FIELD_HEAD_TEXT_MIN_WIDTH = 30;
export const FIELD_HEAD_ICON_GAP_SIZE = 4;

export enum RowHeightLevel {
    short = 1,
    medium = 2,
    tall = 3,
    extraTall = 4
}

export const DEFAULT_POINT_POSITION = {
    targetName: GRID_BLANK,
    realTargetName: GRID_BLANK,
    rowIndex: -1,
    columnIndex: -1,
    x: 0,
    y: 0,
    offsetTop: 0,
    offsetLeft: 0
};

export enum MouseDownType {
    Left,
    Center,
    Right
}
