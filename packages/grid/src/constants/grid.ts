import { AITableFieldType } from '../core';
import { AITableAreaType } from '../types';
import { AI_TABLE_BLANK } from './table';

export const MIN_COLUMN_WIDTH = 80;

export const DBL_CLICK_EDIT_TYPE = [
    AITableFieldType.text,
    AITableFieldType.number,
    AITableFieldType.select,
    AITableFieldType.date,
    AITableFieldType.member
];

export const MOUSEOVER_EDIT_TYPE = [AITableFieldType.progress];

export const RowHeight = {
    Short: 32,
    Medium: 57,
    Tall: 104,
    ExtraTall: 152
};

export const DEFAULT_POINT_POSITION = {
    areaType: AITableAreaType.none,
    targetName: AI_TABLE_BLANK,
    realTargetName: AI_TABLE_BLANK,
    rowIndex: -1,
    columnIndex: -1,
    x: 0,
    y: 0,
    offsetTop: 0,
    offsetLeft: 0
};

export const DEFAULT_SCROLL_STATE = {
    scrollTop: 0,
    scrollLeft: 0,
    isScrolling: false
};
