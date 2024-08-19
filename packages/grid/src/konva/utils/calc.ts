import { AITableField, DEFAULT_COLUMN_WIDTH } from '@ai-table/grid';

// calc and get a width of a column
export const getColumnWidth = (column: AITableField) => (!column || column?.width == null ? DEFAULT_COLUMN_WIDTH : column?.width);

export const getCellHeight = (props: any) => {
    const { field, rowHeight, activeHeight, isActive = false } = props;
    if (!field || !isActive) return rowHeight;
    return activeHeight || rowHeight;
};
