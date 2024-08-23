import { cloneDeep, findIndex, max, min } from 'lodash';
import {
    AITabelGridIndexRange,
    AITableGridCell,
    AITableGridFillDirection,
    AITableGridRange,
    AITableRangeDirection
} from '../interface/grid';
import { AITableGridContext } from '../interface/view';
import { groupArray } from '../utils/helper';
import { AIGrid } from './../interface/table';

const EMPTY_CELL = { recordId: '', fieldId: '' };

const isNumberInRange = (n: number, range: readonly [number, number]) => {
    const [min, max] = range;
    if (n < min || n > max) return false;
    return true;
};

/**
 * 选择区域范围判断
 */
export class Range {
    static instance = new Range(EMPTY_CELL, EMPTY_CELL);

    static bindModel(range?: AITableGridRange) {
        if (range) {
            this.instance.start = range.start;
            this.instance.end = range.end;
        }
        return this.instance;
    }

    constructor(
        public start: AITableGridCell,
        public end: AITableGridCell
    ) {}

    toNumberBaseRange(context: AITableGridContext) {
        const rangeIndex = this.getIndexRange(context);
        if (!rangeIndex) return null;
        return {
            row: rangeIndex.record.min,
            rowCount: rangeIndex.record.max - rangeIndex.record.min + 1,
            column: rangeIndex.field.min,
            columnCount: rangeIndex.field.max - rangeIndex.field.min + 1
        };
    }

    /**
     * 数据坐标系向量 => 数字坐标系范围
     */
    getIndexRange(context: AITableGridContext, range?: AITableGridRange): AITabelGridIndexRange | null {
        const { start, end } = range || Range.instance;
        const startCellIndex = AIGrid.getCellIndex(context, start);
        const endCellIndex = AIGrid.getCellIndex(context, end);
        if (startCellIndex == null || endCellIndex == null) return null;

        return {
            record: {
                min: Math.min(startCellIndex.recordIndex, endCellIndex.recordIndex),
                max: Math.max(startCellIndex.recordIndex, endCellIndex.recordIndex)
            },
            field: {
                min: Math.min(startCellIndex.fieldIndex, endCellIndex.fieldIndex),
                max: Math.max(startCellIndex.fieldIndex, endCellIndex.fieldIndex)
            }
        };
    }

    /**
     * 用户界面数据坐标系向量 => 用户界面数字坐标系范围
     * @param range
     */
    getUIIndexRange(context: AITableGridContext, range?: AITableGridRange): AITabelGridIndexRange | null {
        const { start, end } = range || Range.instance;
        const startCellIndex = AIGrid.getCellUIIndex(context, start);
        const endCellIndex = AIGrid.getCellUIIndex(context, end);
        if (startCellIndex == null || endCellIndex == null) return null;

        return {
            record: {
                min: Math.min(startCellIndex.rowIndex, endCellIndex.rowIndex),
                max: Math.max(startCellIndex.rowIndex, endCellIndex.rowIndex)
            },
            field: {
                min: Math.min(startCellIndex.columnIndex, endCellIndex.columnIndex),
                max: Math.max(startCellIndex.columnIndex, endCellIndex.columnIndex)
            }
        };
    }

    getCellRange(context: AITableGridContext, indexRange: AITabelGridIndexRange): AITableGridRange {
        const visibleRows = AIGrid.getVisibleRows(context);
        const visibleColumns = AIGrid.getVisibleColumns(context);
        return {
            start: {
                recordId: visibleRows[indexRange.record.min]!._id,
                fieldId: visibleColumns[indexRange.field.min]!._id
            },
            end: {
                recordId: visibleRows[indexRange.record.max]!._id,
                fieldId: visibleColumns[indexRange.field.max]!._id
            }
        };
    }

    /**
     * 确定该单元格是否在选择区域内
     * @param cell cell
     */
    contains(context: AITableGridContext, cell: AITableGridCell) {
        const currentCell = AIGrid.getCellIndex(context, cell);
        const indexRange = this.getIndexRange(context);
        if (currentCell == null || indexRange == null) return false;

        const recordIndexRange = [indexRange.record.min, indexRange.record.max] as const;
        const fieldIndexRange = [indexRange.field.min, indexRange.field.max] as const;

        return isNumberInRange(currentCell.recordIndex, recordIndexRange) && isNumberInRange(currentCell.fieldIndex, fieldIndexRange);
    }

    /**
     * 根据悬停单元格计算填充方向，并优先考虑垂直方向
     * @param hoverCell
     */
    getDirection(context: AITableGridContext, hoverCell: AITableGridCell): AITableGridFillDirection | null {
        const hoverCellIndex = AIGrid.getCellIndex(context, hoverCell)!;
        const indexRange = this.getIndexRange(context);

        if (hoverCellIndex == null || indexRange == null) return null;

        const [minRecordIndex, maxRecordIndex] = [indexRange.record.min, indexRange.record.max];
        const [minFieldIndex, maxFieldIndex] = [indexRange.field.min, indexRange.field.max];

        if (hoverCellIndex.recordIndex < minRecordIndex) return AITableGridFillDirection.Top;
        if (hoverCellIndex.recordIndex > maxRecordIndex) return AITableGridFillDirection.Below;
        if (hoverCellIndex.fieldIndex < minFieldIndex) return AITableGridFillDirection.Left;
        if (hoverCellIndex.fieldIndex > maxFieldIndex) return AITableGridFillDirection.Right;
        return null;
    }

    /**
     * 根据填充方向计算要填充的区域
     * @param direction
     */
    getFillRange(context: AITableGridContext, hoverCell: AITableGridCell, direction: AITableGridFillDirection): AITableGridRange | null {
        const indexRange = this.getIndexRange(context);
        const visibleRows = AIGrid.getVisibleRows(context);
        const visibleColumns = AIGrid.getVisibleColumns(context);
        if (!indexRange) return null;
        const [minRecordIndex, maxRecordIndex] = [indexRange.record.min, indexRange.record.max];
        const [minFieldIndex, maxFieldIndex] = [indexRange.field.min, indexRange.field.max];

        switch (direction) {
            case AITableGridFillDirection.Top:
                return {
                    start: { recordId: visibleRows[minRecordIndex - 1]!._id, fieldId: visibleColumns[maxFieldIndex]!._id },
                    end: { recordId: hoverCell.recordId, fieldId: visibleColumns[minFieldIndex]!._id }
                };
            case AITableGridFillDirection.Below:
                return {
                    start: { recordId: visibleRows[maxRecordIndex + 1]!._id, fieldId: visibleColumns[minFieldIndex]!._id },
                    end: { recordId: hoverCell.recordId, fieldId: visibleColumns[maxFieldIndex]!._id }
                };
            case AITableGridFillDirection.Right:
                return {
                    start: { recordId: visibleRows[minRecordIndex]!._id, fieldId: visibleColumns[maxFieldIndex + 1]!._id },
                    end: { recordId: visibleRows[maxRecordIndex]!._id, fieldId: hoverCell.fieldId }
                };
            case AITableGridFillDirection.Left:
                return {
                    start: { recordId: visibleRows[maxRecordIndex]!._id, fieldId: visibleColumns[minFieldIndex - 1]!._id },
                    end: { recordId: visibleRows[minRecordIndex]!._id, fieldId: hoverCell.fieldId }
                };
        }
    }

    /**
     * 合并连续的选择
     *
     * FIXME: 确定其是否连续，当前仅在选择和填充区域中使用.
     *   已知这两者是连续的，所以此处未进行检查.
     *
     * @param ranges
     */
    combine(context: AITableGridContext, range: AITableGridRange) {
        const selfIndexRange = this.getIndexRange(context);
        const otherIndexRange = this.getIndexRange(context, range);
        if (selfIndexRange && !otherIndexRange) return Range.instance;
        if (!selfIndexRange && otherIndexRange) return range;
        if (!selfIndexRange && !otherIndexRange) return null;
        const visibleRows = AIGrid.getVisibleRows(context);
        const visibleColumns = AIGrid.getVisibleColumns(context);

        const res = {
            start: {
                recordId: visibleRows[Math.min(selfIndexRange!.record.min, otherIndexRange!.record.min)]!._id,
                fieldId: visibleColumns[Math.min(selfIndexRange!.field.min, otherIndexRange!.field.min)]!._id
            },
            end: {
                recordId: visibleRows[Math.max(selfIndexRange!.record.max, otherIndexRange!.record.max)]!._id,
                fieldId: visibleColumns[Math.max(selfIndexRange!.field.max, otherIndexRange!.field.max)]!._id
            }
        };
        return res;
    }

    /**
     * 获取选择区域中某个单元格的对角单元格，关于选择区域的中心对称。
     * @param cell
     */
    getDiagonalCell(context: AITableGridContext, cell: AITableGridCell): AITableGridCell | null {
        const indexRange = this.getIndexRange(context);
        if (!indexRange) return null;
        const cellIndex = AIGrid.getCellIndex(context, cell);
        if (!cellIndex) return null;
        const diagonalCellIndex = {
            recordIndex: indexRange.record.max - (cellIndex.recordIndex - indexRange.record.min),
            fieldIndex: indexRange.field.max - (cellIndex.fieldIndex - indexRange.field.min)
        };
        return AIGrid.getCellByIndex(context, diagonalCellIndex);
    }

    /**
     * 移动选区
     * @param direction
     */
    move(context: AITableGridContext, direction: AITableRangeDirection, breakpoints: number[] = []): AITableGridRange | null {
        const activeCell = AIGrid.getActiveCell(context);
        if (!activeCell) return Range.instance;
        const activeCellIndex = AIGrid.getCellIndex(context, activeCell)!;
        const indexRange = this.getIndexRange(context);
        if (!indexRange) return Range.instance;
        const newIndexRange = cloneDeep(indexRange);
        const { fieldIndex, recordIndex } = activeCellIndex;
        const minRangeRowIndex = indexRange.record.min;
        const maxRangeRowIndex = indexRange.record.max;
        // （活动单元格位于选择区域的边界，移动方向） => 扩展/缩小选择区域。
        const isActiveCellAtRangeRightEdge = fieldIndex === indexRange.field.max;
        const isActiveCellAtRangeUpEdge = recordIndex === minRangeRowIndex;
        const isActiveCellAtRangeDownEdge = recordIndex === maxRangeRowIndex;
        const isUpExpand = minRangeRowIndex === maxRangeRowIndex || !isActiveCellAtRangeUpEdge;
        const isDownExpand = minRangeRowIndex === maxRangeRowIndex || !isActiveCellAtRangeDownEdge;

        const visibleRows = AIGrid.getVisibleRows(context);
        const visibleColumns = AIGrid.getVisibleColumns(context);
        const visibleRowsCount = visibleRows.length;
        const maxFieldIndex = visibleColumns.length - 1;

        /**
         * 对于以下三种情况无需采取行动：
         * 1. 当前选择已涵盖第一行，且选择向上移动
         * 2. 当前选择已涵盖最后一行，且选择向下移动
         * 3. 当前选择已被选中，且当前快捷键是全选的选择
         */
        if (
            (direction === AITableRangeDirection.All && minRangeRowIndex === 0 && maxRangeRowIndex === visibleRowsCount - 1) ||
            ([AITableRangeDirection.Up, AITableRangeDirection.UpEdge].includes(direction) && minRangeRowIndex === 0 && isUpExpand) ||
            ([AITableRangeDirection.Down, AITableRangeDirection.DownEdge].includes(direction) &&
                maxRangeRowIndex === visibleRowsCount - 1 &&
                isDownExpand)
        ) {
            return Range.instance;
        }

        let minRowIndex = 0;
        let maxRowIndex = visibleRowsCount - 1;
        let minRowIndexInAllRange = 0;
        let maxRowIndexInAllRange = visibleRowsCount - 1;

        // 分组处理
        if (breakpoints.length) {
            const nextBreakpointIndex = findIndex(breakpoints, (bp) => bp > (isDownExpand ? maxRangeRowIndex : minRangeRowIndex));
            if (nextBreakpointIndex > -1) {
                const nextBreakpoint = breakpoints[nextBreakpointIndex]!;
                const currentBreakpointIndex = nextBreakpointIndex - 1;
                const currentBreakpoint = breakpoints[currentBreakpointIndex]!;
                const isGroupRangeUpEdge = currentBreakpoint === minRangeRowIndex; // 选择是否已涵盖组的顶部边缘
                const isGroupRangeDownEdge = nextBreakpoint === maxRangeRowIndex + 1; // 选择是否已涵盖组的底部边缘
                // 选择范围是否小于活动单元格所在的组
                const isActiveCellInCurrentGroup = currentBreakpoint <= recordIndex && recordIndex < nextBreakpoint;
                /**
                 * 向上扩展选择区域并直接下降到组的起始位置
                 * 向上缩小选择范围到组的结束位置
                 */
                const minRangeOffset = isUpExpand || (isGroupRangeDownEdge && isActiveCellInCurrentGroup) ? 0 : -1;
                /**
                 * 向下扩展选择，直接到组的末尾
                 * 向下缩小选择区域，然后它落到组的起始位置
                 */
                const maxRangeOffset = isDownExpand || (isGroupRangeUpEdge && isActiveCellInCurrentGroup) ? -1 : 0;

                minRowIndex =
                    (isGroupRangeUpEdge ? breakpoints[currentBreakpointIndex - 1]! + minRangeOffset : currentBreakpoint + minRangeOffset) ||
                    0;
                maxRowIndex =
                    (isGroupRangeDownEdge ? breakpoints[nextBreakpointIndex + 1]! + maxRangeOffset : nextBreakpoint + maxRangeOffset) ||
                    maxRowIndex;
                minRowIndexInAllRange = isGroupRangeUpEdge && isGroupRangeDownEdge ? 0 : currentBreakpoint;
                maxRowIndexInAllRange = isGroupRangeUpEdge && isGroupRangeDownEdge ? visibleRowsCount - 1 : nextBreakpoint - 1;
            }
        }

        switch (direction) {
            case AITableRangeDirection.Up:
                if (isActiveCellAtRangeDownEdge) {
                    newIndexRange.record.min--;
                    break;
                }
                newIndexRange.record.max--;
                break;
            case AITableRangeDirection.UpEdge:
                newIndexRange.record.min = minRowIndex;
                if (!isActiveCellAtRangeDownEdge) {
                    newIndexRange.record.max = recordIndex;
                }
                break;
            case AITableRangeDirection.Down:
                if (isActiveCellAtRangeDownEdge) {
                    newIndexRange.record.min++;
                    break;
                }
                newIndexRange.record.max++;
                break;
            case AITableRangeDirection.DownEdge:
                newIndexRange.record.max = maxRowIndex;
                if (isActiveCellAtRangeDownEdge) {
                    newIndexRange.record.min = recordIndex;
                }
                break;
            case AITableRangeDirection.Left:
                if (isActiveCellAtRangeRightEdge) {
                    newIndexRange.field.min--;
                    break;
                }
                newIndexRange.field.max--;
                break;
            case AITableRangeDirection.LeftEdge:
                newIndexRange.field.min = 0;
                if (!isActiveCellAtRangeRightEdge) {
                    newIndexRange.field.max = fieldIndex;
                    break;
                }
                break;
            case AITableRangeDirection.Right:
                if (isActiveCellAtRangeRightEdge) {
                    newIndexRange.field.min++;
                    break;
                }
                newIndexRange.field.max++;
                break;
            case AITableRangeDirection.RightEdge:
                newIndexRange.field.max = maxFieldIndex;
                if (isActiveCellAtRangeRightEdge) {
                    newIndexRange.field.min = fieldIndex;
                }
                break;
            case AITableRangeDirection.All:
                newIndexRange.field.min = 0;
                newIndexRange.field.max = maxFieldIndex;
                newIndexRange.record.min = minRowIndexInAllRange;
                newIndexRange.record.max = maxRowIndexInAllRange;
                break;
        }
        // to fix
        newIndexRange.field.min = Math.max(newIndexRange.field.min, 0);
        newIndexRange.field.max = Math.min(newIndexRange.field.max, maxFieldIndex);
        newIndexRange.record.min = Math.max(newIndexRange.record.min, 0);
        newIndexRange.record.max = Math.min(newIndexRange.record.max, visibleRowsCount - 1);
        return this.getCellRange(context, newIndexRange);
    }

    /**
     * 所选记录为非连续区域，将其转换为具有多个 AITableGridRange 格式的连续区域
     *
     * @param recordIds
     */
    static selectRecord2Ranges(context: AITableGridContext, recordIds: string[]): AITableGridRange[] {
        const rowIndexMap = AIGrid.getPureVisibleRowsIndexMap(context);
        const rows = AIGrid.getPureVisibleRows(context);
        const columns = AIGrid.getVisibleColumns(context);
        const firstFieldId = columns[0]!._id;
        const lastFieldId = columns[columns.length - 1]!._id;
        const sortedRowIndexList = recordIds
            .reduce((acc, recordId) => {
                if (rowIndexMap.has(recordId)) {
                    acc.push(rowIndexMap.get(recordId)!);
                }
                return acc;
            }, [] as number[])
            .sort((a, b) => {
                return a - b;
            });
        const rowIndexRanges = groupArray(sortedRowIndexList);
        const res = rowIndexRanges.map((rowIndexRange) => {
            const minRowIndex = min(rowIndexRange);
            const maxRowIndex = max(rowIndexRange);
            return {
                start: {
                    recordId: rows[minRowIndex!]!._id,
                    fieldId: firstFieldId
                },
                end: {
                    recordId: rows[maxRowIndex!]!._id,
                    fieldId: lastFieldId
                }
            };
        });
        return res;
    }
}
