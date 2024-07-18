import { AITable, AITableFieldType } from '../core';

export const DEFAULT_COLUMN_WIDTH = 200;

export const MIN_COLUMN_WIDTH = 80;

export const DBL_CLICK_EDIT_TYPE = [
    AITableFieldType.Text,
    AITableFieldType.Number,
    AITableFieldType.SingleSelect,
    AITableFieldType.DateTime
];

export const RowHeight = {
    Short: 32,
    Medium: 57,
    Tall: 104,
    ExtraTall: 152
};
