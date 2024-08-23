import { AITableGridCell, AITableGridContext, AITableGridFieldRanges, MouseDownType } from '@ai-table/grid';
import _ from 'lodash';
import SelectionActions from '../actions/selection';
import { AIGrid } from '../interface/table';
import { getParentNodeByClass } from '../utils/helper';

interface AITableAttachEvent {
    viewMouseDown: (activeCell?: AITableGridCell) => void;
}

export const attachEvent = (context: AITableGridContext, e: AITableAttachEvent) => {
    const { aiTable } = context;
    const { viewMouseDown } = e;
    const visibleColumns = AIGrid.getVisibleColumns(context);
    const visibleRows = AIGrid.getVisibleRows(context);
    const selectRanges = AIGrid.getSelectRanges(context);
    const activeCell = AIGrid.getActiveCell(context);
    const fieldRanges = AIGrid.getFieldRanges(context);
    const fieldIndexMap = AIGrid.getVisibleColumnsMap(context);

    function generateFieldRanges(e: MouseEvent, fieldId: string, columnIndex: number): AITableGridFieldRanges {
        const defaultFieldRanges = [fieldId];

        if (!fieldRanges) {
            return defaultFieldRanges;
        }

        const originFieldRanges = fieldRanges;

        const fieldIndexes = fieldRanges.map((id) => fieldIndexMap!.get(id)!);

        const startIdx = fieldIndexes[0];
        const endIdx = fieldIndexes[fieldRanges.length - 1];
        if (e.shiftKey && !fieldIndexes.includes(columnIndex)) {
            return visibleColumns!
                .map((column) => column._id)
                .slice(_.min([startIdx, endIdx, columnIndex]), _.max([startIdx, endIdx, columnIndex])! + 1);
        }

        if (!e.shiftKey && columnIndex >= startIdx && columnIndex <= endIdx) {
            return originFieldRanges;
        }

        return defaultFieldRanges;
    }

    function handleForHeader(
        e: MouseEvent,
        context: AITableGridContext,
        fieldId: string,
        columnIndex: number,
        isChangeColumnWidth: boolean
    ) {
        viewMouseDown();

        if (isChangeColumnWidth) return;

        const firstRecord = visibleRows[0];
        const lastRecord = visibleRows[visibleRows.length - 1];
        const _fieldRanges = generateFieldRanges(e, fieldId, columnIndex);

        if (!firstRecord) {
            // 需要区分当前是否按下了 shift 键
            SelectionActions.setFieldRanges(context, _fieldRanges);
            return;
        }

        SelectionActions.setFieldRanges(context, _fieldRanges);
        SelectionActions.setSelection(context, {
            start: {
                recordId: firstRecord._id,
                fieldId: _fieldRanges[0]
            },
            end: {
                recordId: lastRecord._id,
                fieldId: _fieldRanges[_fieldRanges.length - 1]
            }
        });
    }

    function handleForFillBar() {
        // Fill handler first press
        const selectionRange = selectRanges && selectRanges[0];
        if (!selectionRange) return;
        SelectionActions.setFillHandleStatus(context, { isActive: true });
    }

    //通过 Shift 键合并选择区域
    function combineRangeByShift(hoverCell: AITableGridCell) {
        SelectionActions.setSelection(context, {
            start: activeCell!,
            end: hoverCell
        });
    }

    function handleForCell(e: MouseEvent, hoverCell: AITableGridCell) {
        const cellInSelection = AIGrid.isCellInSelection(context, hoverCell);
        if (e.button === MouseDownType.Right && cellInSelection) {
            return;
        }
        viewMouseDown(hoverCell);

        if (e.shiftKey && activeCell) {
            return combineRangeByShift(hoverCell);
        }
        SelectionActions.setActiveCell(context, hoverCell);
    }

    // 展开记录，如果点击遮罩将其折叠，则阻止其鼠标按下事件
    function isClickInExpandModal(e: MouseEvent) {
        const modalRoot = document.querySelector('.ant-modal-root');
        if (modalRoot && modalRoot.contains(e.target as HTMLElement)) return true;
        return false;
    }

    function handleForOtherArea(e: MouseEvent, isOperateHead: boolean) {
        if (isClickInExpandModal(e)) return;
        if (isOperateHead) return;
        if (getParentNodeByClass(e.target as HTMLElement, 'hideenFieldItem')) return;
        // 确定在 DOM 模式下的一次点击是否是滚动条
        // const gridContainer = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
        // const verticalScrollBar = gridContainer?.nextSibling;
        // const horizontalScrollBar = verticalScrollBar?.nextSibling;
        // if (horizontalScrollBar?.contains(e.target as Element)) return;
        // if (verticalScrollBar?.contains(e.target as Element)) return;

        // if (!document.getElementById(DATASHEET_ID.DOM_CONTAINER)!.contains(e.currentTarget as Element)) {
        //     viewMouseDown();
        // }

        SelectionActions.clearSelection(context);
        // dispatch(StoreActions.clearActiveRowInfo(datasheetId));
    }

    function handleForOperateColumn() {
        viewMouseDown();
    }

    return {
        handleForHeader,
        handleForFillBar,
        handleForCell,
        handleForOtherArea,
        handleForOperateColumn
    };
};
