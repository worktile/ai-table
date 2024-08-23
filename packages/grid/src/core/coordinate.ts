import { AITableCellMetaData, AITableCellMetaDataMap, AITableCoordinate, AITableItemType, AITableSizeMap } from '../types';

/**
 * 用于构建 Canvas 基础坐标系，后续的绘制工作以此为基础
 */
export class Coordinate {
    protected _rowHeight: number;
    protected _columnWidth: number;
    public rowCount: number;
    public columnCount: number;
    public containerWidth: number;
    public containerHeight: number;
    // 用 index 映射 每一行的 高度
    public rowIndicesMap: AITableSizeMap = {};
    // 用 index 映射 每一列 的 宽度
    public columnIndicesMap: AITableSizeMap = {};
    // 滚动区域垂直初始距离
    public rowInitSize: number;
    // 滚动区域水平初始距离
    public columnInitSize: number;
    // 行坐标集中最后一行的索引
    public lastRowIndex = -1;
    // 列坐标集中最后一列的索引
    public lastColumnIndex = -1;
    public frozenColumnCount: number;
    constructor({
        rowHeight,
        columnWidth,
        rowCount,
        columnCount,
        containerWidth,
        containerHeight,
        rowIndicesMap = {},
        columnIndicesMap = {},
        rowInitSize = 0,
        columnInitSize = 0,
        frozenColumnCount = 0
    }: AITableCoordinate) {
        this._rowHeight = rowHeight;
        this._columnWidth = columnWidth;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.rowInitSize = rowInitSize;
        this.columnInitSize = columnInitSize;
        this.containerWidth = containerWidth;
        this.rowIndicesMap = rowIndicesMap;
        this.columnIndicesMap = columnIndicesMap;
        this.containerHeight = containerHeight;
        this.frozenColumnCount = frozenColumnCount;
    }

    public get columnWidth() {
        return this._columnWidth;
    }

    public set columnWidth(width: number) {
        this._columnWidth = width;
    }

    public get rowHeight() {
        return this._rowHeight;
    }

    public set rowHeight(height: number) {
        this._rowHeight = height;
    }

    /**
     * 总宽度
     */
    public get totalWidth() {
        const { offset, size } = this.getCellMetaData(this.columnCount - 1, AITableItemType.Column);
        return offset + size;
    }

    /**
     * 总高度
     */
    public get totalHeight() {
        const { offset, size } = this.getCellMetaData(this.rowCount - 1, AITableItemType.Row);
        return offset + size;
    }

    /**
     * 根据 rowIndex 获取对应行高
     */
    public getRowHeight(index: number) {
        return this.rowIndicesMap[index] ?? this.rowHeight;
    }

    /**
     * 根据 columnIndex 获取对应列宽
     */
    public getColumnWidth(index: number) {
        return this.columnIndicesMap[index] ?? this.columnWidth;
    }

    /**
     * 获取每个 cell 垂直/水平方向的坐标信息
     */
    protected getCellMetaData(index: number, itemType: AITableItemType): AITableCellMetaData {
        let itemSize, lastMeasuredIndex, offset, indexToWidthHeightMap;
        let indexToDimensionMap: AITableCellMetaDataMap = {};
        const isColumnType = itemType === AITableItemType.Column;

        if (isColumnType) {
            itemSize = this.columnWidth;
            offset = this.columnInitSize;
            lastMeasuredIndex = this.lastColumnIndex;
            indexToWidthHeightMap = this.columnIndicesMap;
        } else {
            itemSize = this.rowHeight;
            offset = this.rowInitSize;
            lastMeasuredIndex = this.lastRowIndex;
            indexToWidthHeightMap = this.rowIndicesMap;
        }

        if (lastMeasuredIndex >= 0) {
            const size = indexToWidthHeightMap[lastMeasuredIndex];
            offset = size;
        }

        if (index > lastMeasuredIndex) {
            for (let i = lastMeasuredIndex + 1; i <= index; i++) {
                const size = (isColumnType ? this.columnIndicesMap[i] : this.rowIndicesMap[i]) ?? itemSize;
                indexToDimensionMap[i] = {
                    offset,
                    size
                };
                offset += size;
            }
            if (isColumnType) {
                this.lastColumnIndex = index;
            } else {
                this.lastRowIndex = index;
            }
        }
        return indexToDimensionMap[index] || { size: 0, offset: 0 };
    }

    /**
     * 查找最近的单元格索引
     * 性能较差，但无论如何都可以找到
     */
    private _findNearestCellIndex(index: number, offset: number, itemType: AITableItemType) {
        const itemCount = itemType === AITableItemType.Column ? this.columnCount : this.rowCount;
        let interval = 1;

        while (index < itemCount && this.getCellMetaData(index, itemType).offset < offset) {
            index += interval;
            interval *= 2;
        }

        return this._findNearestCellIndexByBinary(offset, Math.floor(index / 2), Math.min(index, itemCount - 1), itemType);
    }

    /**
     * 二分法查找最近的单元格索引
     * 性能更佳，但需要加载数据
     */
    private _findNearestCellIndexByBinary(offset: number, low: number, high: number, itemType: AITableItemType) {
        while (low <= high) {
            const middle = low + Math.floor((high - low) / 2);
            const currentOffset = this.getCellMetaData(middle, itemType).offset;

            if (currentOffset === offset) {
                return middle;
            } else if (currentOffset < offset) {
                low = middle + 1;
            } else if (currentOffset > offset) {
                high = middle - 1;
            }
        }
        return low > 0 ? low - 1 : 0;
    }

    /**
     * 根据偏移量查找最近的单元格索引
     */
    public findNearestCellIndex(offset: number, itemType: AITableItemType) {
        let lastIndex;
        if (itemType === AITableItemType.Column) {
            lastIndex = this.lastColumnIndex;
        } else {
            lastIndex = this.lastRowIndex;
        }
        const cellOffset = this.getCellMetaData(lastIndex, itemType).offset;
        const lastMeasuredItemOffset = lastIndex > 0 ? cellOffset : 0;

        if (lastMeasuredItemOffset >= offset) {
            return this._findNearestCellIndexByBinary(offset, 0, lastIndex, itemType);
        }
        return this._findNearestCellIndex(Math.max(0, lastIndex), offset, itemType);
    }

    /**
     * 根据垂直偏移量找到起始单元格的索引
     */
    public getRowStartIndex(offset: number) {
        return this.findNearestCellIndex(offset, AITableItemType.Row);
    }

    /**
     * 根据垂直起始单元格的索引查找结束单元格的索引
     */
    public getRowStopIndex(startIndex: number, scrollTop: number) {
        const itemMetadata = this.getCellMetaData(startIndex, AITableItemType.Row);
        const maxOffset = scrollTop + this.containerHeight;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;

        while (stopIndex < this.rowCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += this.getCellMetaData(stopIndex, AITableItemType.Row).size;
        }
        return stopIndex;
    }

    /**
     * 根据水平偏移量找到起始单元格的索引
     */
    public getColumnStartIndex(offset: number) {
        return this.findNearestCellIndex(offset, AITableItemType.Column);
    }

    /**
     * 根据水平起始单元格的索引查找结束单元格的索引
     */
    public getColumnStopIndex(startIndex: number, scrollLeft: number) {
        const itemMetadata = this.getCellMetaData(startIndex, AITableItemType.Column);
        const maxOffset = scrollLeft + this.containerWidth;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;

        while (stopIndex < this.columnCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += this.getCellMetaData(stopIndex, AITableItemType.Column).size;
        }
        return stopIndex;
    }

    /**
     * 根据 rowIndex 获取垂直偏移量
     */
    public getRowOffset(rowIndex: number) {
        return this.getCellMetaData(rowIndex, AITableItemType.Row).offset;
    }

    /**
     * 根据 columnIndex 获取水平偏移量
     */
    public getColumnOffset(columnIndex: number) {
        return this.getCellMetaData(columnIndex, AITableItemType.Column).offset;
    }

    /**
     * 冻结区域宽度
     */
    get frozenColumnWidth() {
        return this.getColumnOffset(this.frozenColumnCount) - this.columnInitSize;
    }

    /**
     * 根据 rowIndex, columnIndex 获取单元格坐标信息
     */
    public getCellRect(rowIndex: number, columnIndex: number) {
        const { size: height, offset: y } = this.getCellMetaData(rowIndex, AITableItemType.Row);
        const { size: width, offset: x } = this.getCellMetaData(columnIndex, AITableItemType.Column);
        return {
            x,
            y,
            width,
            height
        };
    }
}
