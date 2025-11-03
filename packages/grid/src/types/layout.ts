export interface AITableLayout {
    x: number;
    y: number;
    rowIndex: number;
    columnIndex: number;
    rowHeight: number;
    columnWidth: number;
    columnCount: number;
    containerWidth: number;
    rowHeadWidth: number;
    hiddenIndexColumn: boolean;
    frozenColumnCount: number;
    hiddenRowDrag?: boolean;
    readonly?: boolean;
    xIsScroll?: boolean;
}

export interface AITableCellLayout {
    x?: number;
    y?: number;
    itemOffsetX?: number;
    minItemWidth?: number;
    noMoreItem?: boolean;
    renderWidth?: number;
}

export interface AITableCellItem {
    x?: number;
    y?: number;
    width: number;
    height: number;
}
