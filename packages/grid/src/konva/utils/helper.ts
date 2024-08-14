import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../constants/grid';

/**
 * Generate the targetName of the graph based on the incoming information
 */
export const generateTargetName = ({ targetName, fieldId, recordId, mouseStyle }: any) => {
    const flag = '$';
    return `${targetName}-${fieldId || flag}-${recordId || flag}-${mouseStyle || flag}`;
};

export const getCellOffsetLeft = (depth: number) => {
    if (!depth) return 0;
    if (depth > 1) return (depth - 1) * GRID_GROUP_OFFSET;
    return 0;
};

export const isWithinFrozenColumnBoundary = (x: number, depth: number, frozenColumnWidth: number) => {
    const offset = getCellOffsetLeft(depth);
    const max = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    const min = GRID_ROW_HEAD_WIDTH + offset;
    return x > min && x < max;
};
