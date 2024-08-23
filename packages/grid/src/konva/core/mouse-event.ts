import { KonvaEventObject } from 'konva/lib/Node';
import { isEqual } from 'lodash';
import SelectionActions from '../actions/selection';
import {
    GRID_BOTTOM_STAT,
    GRID_BOTTOM_STAT_HEIGHT,
    GRID_CELL,
    GRID_CELL_FILL_HANDLER,
    GRID_CELL_LINK_ICON,
    GRID_DATE_CELL_ALARM,
    GRID_DATE_CELL_CREATE_ALARM,
    GRID_FIELD_ADD_BUTTON,
    GRID_FIELD_HEAD,
    GRID_FIELD_HEAD_DESC,
    GRID_FIELD_HEAD_MORE,
    GRID_FIELD_HEAD_OPACITY_LINE,
    GRID_FIELD_HEAD_SELECT_CHECKBOX,
    GRID_FROZEN_SHADOW_LINE,
    GRID_GROUP_STAT,
    GRID_GROUP_TOGGLE_BUTTON,
    GRID_ROW_ADD_BUTTON,
    GRID_ROW_DRAG_HANDLER,
    GRID_ROW_EXPAND_RECORD,
    GRID_ROW_HEAD,
    GRID_ROW_HEAD_WIDTH,
    GRID_ROW_SELECT_CHECKBOX,
    MouseDownType
} from '../constants';
import { AIGrid } from '../interface/table';
import { AITableGridContext, AITablePointPosition } from '../interface/view';
import { setMouseStyle } from '../transforms/view';
import { getDetailByTargetName } from '../utils/helper';
import { attachEvent } from './attach-event';
import { Coordinate } from './coordinate';

interface AITableGridMouseEvent {
    context: AITableGridContext;
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex?: number;
    columnStopIndex?: number;
    offsetX?: number;
    getMousePosition: (x: number, y: number, targetName?: string) => AITablePointPosition;
    scrollTop?: number;
}

export const gridMouseEvent = (config: AITableGridMouseEvent) => {
    const {
        context,
        instance,
        rowStartIndex,
        rowStopIndex,
        offsetX = 0,
        getMousePosition,
        columnStartIndex,
        columnStopIndex,
        scrollTop
    } = config;
    const { aiTable, pointPosition, isCellDown, canAppendRow, linearRows, setCellDown, setCanAppendRow } = context;
    const { rowInitSize, frozenColumnWidth, containerWidth, containerHeight } = instance;
    const { x: pointX, y: pointY, targetName, realTargetName, rowIndex: pointRowIndex, columnIndex: pointColumnIndex } = pointPosition;
    const visibleColumns = AIGrid.getVisibleColumns(context);
    const visibleRows = AIGrid.getVisibleRows(context);
    const recordRanges = AIGrid.getSelectionRecordRanges(context);
    const visibleRowsIndexMap = AIGrid.getPureVisibleRowsIndexMap(context);
    const fillHandleStatus = AIGrid.getFillHandleStatus(context);
    const pointRecordId = linearRows[pointRowIndex]?.recordId;
    const pointFieldId = visibleColumns[pointColumnIndex]?._id;
    let isFillStart = false;
    const { handleForHeader, handleForCell, handleForFillBar, handleForOtherArea } = attachEvent(context, {
        viewMouseDown: () => {}
    });

    /**
     * 激活单元格操作
     */
    const activeGridCell = (mouseEvent: MouseEvent, targetName: string, rowIndex: number, columnIndex: number) => {
        if (rowIndex === -1 && columnIndex === -1) return;
        mouseEvent.preventDefault();
        const { recordId: targetRecordId, fieldId: targetFieldId } = getDetailByTargetName(targetName);
        const currentActiveCell =
            targetRecordId && targetFieldId
                ? {
                      recordId: targetRecordId,
                      fieldId: targetFieldId
                  }
                : null;
        if (currentActiveCell) {
            setCellDown(true);
            // 防止单元格事件的多次激活
            const activeCell = AIGrid.getActiveCell(context);
            if (isEqual(currentActiveCell, activeCell)) return;
            handleForCell(mouseEvent, currentActiveCell);
        }
    };

    /**
     * 添加行操作
     */
    const addRow = (recordId: string) => {
        const rowCount = visibleRows.length;
        const finalRecordId = rowCount > 0 ? visibleRows[rowCount - 1]._id : '';
        console.log('add row:', finalRecordId);
    };

    /**
     * 选择行操作
     */
    const selectRow = (mouseEvent: MouseEvent, recordId: string) => {
        if (!recordId) return;
        // TODO: 选择行操作
        const defaultFn = () => {};

        if (mouseEvent.shiftKey) {
            if (!recordRanges || recordRanges.length === 0) return defaultFn();
            if (recordRanges.includes(recordId)) return;

            const rowIndexs = recordRanges.map((id) => visibleRowsIndexMap.get(id)!).sort((a, b) => a - b);
            const checkedRowIndex = visibleRowsIndexMap.get(pointRecordId)!;
            const [startIndex, endIndex] = [
                Math.min(checkedRowIndex, rowIndexs[0]),
                Math.max(checkedRowIndex, rowIndexs[rowIndexs.length - 1])
            ];
            // TODO: 设置行选区 setRecordRange
            // return StoreActions.setRecordRange(datasheetId, visibleRecordIds.slice(startIndex, endIndex + 1));
        }
        return defaultFn();
    };

    /**
     * 选择所有单元格操作
     */
    const selectAll = () => {
        console.log('select all');
        const recordIds = recordRanges?.length === visibleRows.length ? [] : visibleRows.map((r) => r._id);
        // TODO: 设置行选区
        // return StoreActions.setRecordRange(recordIds);
    };

    /**
     * 网格边框滚动操作
     */
    const scrollByPosition = () => {
        const toTopSpacing = pointY - rowInitSize;
        const toBottomSpacing = containerHeight - pointY - GRID_BOTTOM_STAT_HEIGHT;
        const toLeftSpacing = pointX - GRID_ROW_HEAD_WIDTH - frozenColumnWidth - offsetX;
        const toRightSpacing = containerWidth ? containerWidth - pointX - offsetX : Infinity;
    };

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const mouseEvent = e.evt;
        const _targetName = e.target.name();
        const { targetName, fieldId: targetFieldId } = getDetailByTargetName(_targetName);
        switch (targetName) {
            case GRID_FIELD_HEAD_MORE:
            case GRID_FIELD_HEAD: {
                mouseEvent.preventDefault();
                if (!targetFieldId) return;
                setCanAppendRow(false);
                // todo: 设置选中整列
                return handleForHeader(mouseEvent, context, targetFieldId, pointColumnIndex, false);
            }
            // Fill handler
            case GRID_CELL_FILL_HANDLER: {
                if (mouseEvent.button === MouseDownType.Right) return;
                // todo: 填充开始
                isFillStart = true;
                setCanAppendRow(true);
                return handleForFillBar();
            }
            // 激活的单元格
            case GRID_DATE_CELL_CREATE_ALARM:
            case GRID_DATE_CELL_ALARM:
            case GRID_CELL: {
                setCanAppendRow(false);
                return activeGridCell(mouseEvent, _targetName, pointRowIndex, pointColumnIndex);
            }
            case GRID_ROW_HEAD:
            case GRID_ROW_SELECT_CHECKBOX:
            case GRID_FIELD_HEAD_SELECT_CHECKBOX: {
                if (mouseEvent.button === MouseDownType.Right) return;
                setCanAppendRow(false);
                // todo: 编辑位置
                return;
            }
            default: {
                if (targetName !== GRID_ROW_ADD_BUTTON) {
                    setCanAppendRow(false);
                }
                // 点击其他区域取消选区、选中
                return handleForOtherArea(mouseEvent, false);
            }
        }
    };

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();

        const activeCell = AIGrid.getActiveCell(context);
        if (activeCell) {
            const { recordId: activeRecordId, fieldId: activeFieldId } = activeCell;
            const { recordId: targetRecordId, fieldId: targetFieldId } = getDetailByTargetName(realTargetName);
            if (activeRecordId === targetRecordId && activeFieldId === targetFieldId) return;
            // 拖选单元格操作
            if (isCellDown) {
                scrollByPosition();
                return SelectionActions.setSelection(context, {
                    start: activeCell,
                    end: {
                        recordId: pointRecordId,
                        fieldId: pointFieldId
                    }
                });
            }
            // Drag-and-drop handle operation
            if (fillHandleStatus?.isActive && isFillStart) {
                scrollByPosition();
                return SelectionActions.setFillHandleStatus(context, {
                    isActive: true,
                    hoverCell: {
                        recordId: pointRecordId,
                        fieldId: pointFieldId
                    }
                });
            }
        }
    };

    const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        // 重置状态
        setCellDown(false);
        isFillStart = false;
    };

    const onClick = (e: KonvaEventObject<MouseEvent>) => {
        const mouseEvent = e.evt;
        mouseEvent.preventDefault();
        if (mouseEvent.button !== MouseDownType.Left) return;

        if (targetName === GRID_ROW_ADD_BUTTON && !canAppendRow) {
            setCanAppendRow(true);
            return;
        }

        switch (targetName) {
            case GRID_ROW_ADD_BUTTON: {
                return addRow(pointRecordId);
            }
            case GRID_ROW_SELECT_CHECKBOX: {
                return selectRow(mouseEvent, pointRecordId);
            }
            case GRID_FIELD_HEAD_SELECT_CHECKBOX: {
                return selectAll();
            }
        }
    };

    const onTap = (e: KonvaEventObject<MouseEvent>) => {
        const mouseEvent = e.evt;
        mouseEvent.preventDefault();

        const target = e.target;
        const _targetName = target.name();
        const pos = target.getStage()?.getPointerPosition();

        if (pos == null) return;

        const { x, y } = pos;
        const { targetName, rowIndex, columnIndex } = getMousePosition(x, y, _targetName);
        const pointRecordId = linearRows[rowIndex]?.recordId;
        switch (targetName) {
            case GRID_ROW_ADD_BUTTON: {
                return addRow(pointRecordId);
            }
            case GRID_ROW_SELECT_CHECKBOX: {
                return selectRow(mouseEvent, pointRecordId);
            }
            case GRID_FIELD_HEAD_SELECT_CHECKBOX: {
                return selectAll();
            }
            case GRID_CELL: {
                return activeGridCell(mouseEvent, _targetName, rowIndex, columnIndex);
            }
            default: {
                if (targetName !== GRID_ROW_ADD_BUTTON) {
                    setCanAppendRow(true);
                }
                // 点击其他区域取消选区、选中
                return;
            }
        }
    };

    /**
     * 设置鼠标样式
     * @param realTargetName
     * @param areaType
     * @returns
     */
    const handleMouseStyle = (realTargetName: string) => {
        const { targetName, mouseStyle } = getDetailByTargetName(realTargetName);
        if (mouseStyle) return setMouseStyle(aiTable, mouseStyle);

        switch (targetName) {
            case GRID_CELL_FILL_HANDLER: {
                return setMouseStyle(aiTable, 'crosshair');
            }
            case GRID_FIELD_HEAD_OPACITY_LINE: {
                return setMouseStyle(aiTable, 'col-resize');
            }
            case GRID_DATE_CELL_ALARM:
            case GRID_DATE_CELL_CREATE_ALARM:
            case GRID_ROW_ADD_BUTTON:
            case GRID_ROW_DRAG_HANDLER:
            case GRID_FIELD_HEAD_SELECT_CHECKBOX:
            case GRID_FIELD_HEAD_MORE:
            case GRID_ROW_EXPAND_RECORD:
            case GRID_ROW_SELECT_CHECKBOX:
            case GRID_GROUP_TOGGLE_BUTTON:
            case GRID_CELL_LINK_ICON:
            case GRID_FIELD_ADD_BUTTON:
            case GRID_FIELD_HEAD_DESC:
            case GRID_BOTTOM_STAT:
            case GRID_GROUP_STAT:
            case GRID_FROZEN_SHADOW_LINE: {
                return setMouseStyle(aiTable, 'pointer');
            }
            default:
                return setMouseStyle(aiTable, 'default');
        }
    };

    return {
        onTap,
        onClick,
        onMouseUp,
        onMouseDown,
        onMouseMove,
        handleMouseStyle
    };
};
