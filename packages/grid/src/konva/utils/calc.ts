import { AITableField, DEFAULT_COLUMN_WIDTH } from '@ai-table/grid';

// calc and get a width of a column
export const getColumnWidth = (column: AITableField) => (!column || column?.width == null ? DEFAULT_COLUMN_WIDTH : column?.width);
