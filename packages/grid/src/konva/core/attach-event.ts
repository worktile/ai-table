import { AITableGridCell, AITableGridContext, AITableGridFieldRanges, MouseDownType } from '@ai-table/grid';
import SelectionActions from '../actions/selection';
import { getParentNodeByClass } from '../utils/helper';

interface AITableAttachEvent {
    viewMouseDown: (activeCell?: AITableGridCell) => void;
}

export const attachEvent = (context: AITableGridContext, e: AITableAttachEvent) => {
    const { aiTable, fields, records } = context;
    const { viewMouseDown } = e;
    const activeCell = aiTable().selection().activeCell;
    const fieldRanges = aiTable().selection().fieldRanges;

    function generateFieldRanges(e: MouseEvent, fieldId: string, columnIndex: number): AITableGridFieldRanges {
        const defaultFieldRanges = [fieldId];

        if (!fieldRanges) {
            return defaultFieldRanges;
        }

        const originFieldRanges = fieldRanges;

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

        const { fields, records } = context;
        const firstRecord = records()[0];
        const lastRecord = fields()[records().length - 1];
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
        SelectionActions.setFillHandleStatus(context, { isActive: true });
    }

    // Merge selections by shift key
    function combineRangeByShift(hoverCell: AITableGridCell) {
        SelectionActions.setSelection(context, {
            start: activeCell!,
            end: hoverCell
        });
    }

    function handleForCell(e: MouseEvent, hoverCell: AITableGridCell) {
        if (e.button === MouseDownType.Right) {
            return;
        }
        viewMouseDown(hoverCell);

        if (e.shiftKey && activeCell) {
            return combineRangeByShift(hoverCell);
        }
        SelectionActions.setActiveCell(context, hoverCell);
    }

    // Expand the record, and if you click on the mask to collapse it, block its mouseDown event
    function isClickInExpandModal(e: MouseEvent) {
        const modalRoot = document.querySelector('.ant-modal-root');
        if (modalRoot && modalRoot.contains(e.target as HTMLElement)) return true;
        return false;
    }

    function handleForOtherArea(e: MouseEvent, isOperateHead: boolean) {
        if (isClickInExpandModal(e)) return;
        if (isOperateHead) return;
        if (getParentNodeByClass(e.target as HTMLElement, 'hideenFieldItem')) return;
        // Determining whether a click is a scrollbar in DOM mode
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
