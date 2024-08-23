import { AITableField, AITableFieldType, AITableGridContext, FieldValue } from '@ai-table/grid';
import { CellText } from './cell-text';

export interface AITableGridCellConfig {
    context: AITableGridContext;
    field: AITableField;
    recordId: string;
    x: number;
    y: number;
    rowHeight: number;
    columnWidth: number;
    cellValue: FieldValue;
    renderData: any;
    isActive?: boolean;
    editable?: boolean;
    style?: any;
    toggleEdit?: () => void;
    onChange?: (value: FieldValue) => void;
}

export interface AITableGridCellValue {
    x: number;
    y: number;
    rowHeight: number;
    columnWidth: number;
    field: AITableField;
    recordId: string;
    cellValue: FieldValue;
    datasheetId: string;
    editable?: boolean;
    isActive?: boolean;
    style?: any;
    disabledDownload?: boolean;
}

export const CellValue = (config: AITableGridCellConfig) => {
    const { context, x, y, rowHeight, columnWidth, field, recordId, isActive, editable, style, cellValue, renderData } = config;

    const onChange = (value: FieldValue) => {
        if (editable) {
            // 设置编辑后数据
        }
    };

    const toggleEdit = () => {
        // TODO: 切换编辑
    };

    const cellProps: AITableGridCellConfig = {
        context,
        field,
        recordId,
        onChange,
        isActive,
        toggleEdit,
        editable,
        x,
        y,
        rowHeight,
        columnWidth,
        style,
        cellValue,
        renderData
    };

    switch (field.type) {
        case AITableFieldType.text:
        case AITableFieldType.date:
        case AITableFieldType.createdAt:
        case AITableFieldType.updatedAt:
            return CellText(cellProps);
    }
    return null;
};
