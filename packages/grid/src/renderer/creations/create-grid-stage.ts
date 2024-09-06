import Konva from 'konva/lib';
import { KonvaEventObject } from 'konva/lib/Node';
import _ from 'lodash';
import {
    AI_TABLE_BLANK,
    AI_TABLE_CELL,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ROW_HEAD_WIDTH,
    DEFAULT_POINT_POSITION
} from '../../constants';
import { AITable, Coordinate } from '../../core';
import { AITableGridStageOptions } from '../../types';
import { getColumnIndicesMap, getDetailByTargetName, getTargetName, getVisibleRangeInfo } from '../../utils';
import { createAddFieldColumn } from './create-add-field-column';
import { createAllCells } from './create-all-cells';
import { createDynamicCells } from './create-dynamic-cells';
import { createColumnHeads } from './create-heads';

Konva.pixelRatio = 2;

export const createGridStage = (config: AITableGridStageOptions) => {
    const { aiTable, context, width, height, container } = config;
    const { linearRows, scrollState, pointPosition } = context;
    const { scrollTop, scrollLeft } = scrollState();
    const fields = AITable.getVisibleFields(aiTable);
    const activeCell = AITable.getActiveCell(aiTable);
    const offsetX = 0;
    let _pointPosition = pointPosition();

    const coordinateInstance = new Coordinate({
        rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
        rowCount: linearRows.length,
        columnCount: fields.length,
        containerWidth: width,
        containerHeight: height,
        rowInitSize: AI_TABLE_FIELD_HEAD_HEIGHT,
        columnInitSize: AI_TABLE_ROW_HEAD_WIDTH,
        rowIndicesMap: {},
        columnIndicesMap: getColumnIndicesMap(fields),
        frozenColumnCount: 1
    });

    const { frozenColumnWidth } = coordinateInstance;
    const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = getVisibleRangeInfo(coordinateInstance, scrollState());
    const { containerWidth, containerHeight } = coordinateInstance;

    const { columnHeads, frozenColumnHead } = createColumnHeads({
        instance: coordinateInstance,
        columnStartIndex,
        columnStopIndex,
        fields: aiTable.fields()
    });

    const { frozenCells, cells } = createAllCells({
        aiTable,
        context,
        instance: coordinateInstance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

    const { placeHolderCells, frozenPlaceHolderCells, activatedCell, activeCellBorder, frozenActivatedCell, frozenActiveCellBorder } =
        createDynamicCells({
            aiTable,
            context,
            instance: coordinateInstance,
            rowStartIndex,
            rowStopIndex,
            columnStartIndex,
            columnStopIndex
        });

    const setImmediatePointPosition = (e: KonvaEventObject<MouseEvent>) => {
        const targetName = e.target.name();
        const pos = e.target.getStage()!.getPointerPosition();
        if (pos == null) return;
        const { x, y } = pos;
        const curMousePosition = getMousePosition(x, y, targetName);
        pointPosition.set(curMousePosition);
        _pointPosition = curMousePosition;
    };

    const isWithinFrozenColumnBoundary = (x: number, frozenColumnWidth: number) => {
        const max = AI_TABLE_ROW_HEAD_WIDTH + frozenColumnWidth;
        const min = AI_TABLE_ROW_HEAD_WIDTH;
        return x > min && x < max;
    };

    const getMousePosition = (x: number, y: number, _targetName?: string) => {
        if (x < offsetX) {
            return DEFAULT_POINT_POSITION;
        }
        const offsetTop = scrollTop + y;
        const rowIndex = coordinateInstance.getRowStartIndex(offsetTop);
        const realX = x - offsetX;
        const offsetLeft = isWithinFrozenColumnBoundary(realX, frozenColumnWidth) ? realX : scrollLeft + realX;
        const columnIndex = coordinateInstance.getColumnStartIndex(offsetLeft);
        const targetName = getTargetName(_targetName);
        return {
            targetName,
            realTargetName: _targetName || AI_TABLE_BLANK,
            rowIndex,
            columnIndex,
            offsetTop,
            offsetLeft,
            x: realX,
            y
        };
    };

    const setActiveCell = (mouseEvent: MouseEvent, targetName: string, rowIndex: number, columnIndex: number) => {
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
            // Prevent multiple activation of cell events
            if (_.isEqual(currentActiveCell, activeCell)) return;

            const { recordId, fieldId } = currentActiveCell;
            aiTable.selection().selectedCells.set(recordId, { [fieldId]: true });
        }
    };

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const mouseEvent = e.evt;
        const _targetName = e.target.name();
        const { targetName } = getDetailByTargetName(_targetName);
        switch (targetName) {
            // activated cell
            case AI_TABLE_CELL: {
                const { rowIndex: pointRowIndex, columnIndex: pointColumnIndex } = _pointPosition;
                return setActiveCell(mouseEvent, _targetName, pointRowIndex, pointColumnIndex);
            }
            default: {
                // 移动出表格区域时清空选区
                return;
            }
        }
    };

    const gridStage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
        draggable: false,
        listening: true
    });
    gridStage.on('mousedown', (e: KonvaEventObject<MouseEvent>) => {
        setImmediatePointPosition(e);
        onMouseDown(e);
    });

    const gridLayer = new Konva.Layer();
    const gridGroup = new Konva.Group();
    const frozenGroup = new Konva.Group();
    const commonGroup = new Konva.Group();

    gridGroup.add(frozenGroup);
    gridGroup.add(commonGroup);

    const frozenColumnHeadGroup = new Konva.Group();
    frozenColumnHeadGroup.add(...frozenColumnHead);

    const frozenCellsGroup = new Konva.Group();
    frozenGroup.add(frozenColumnHeadGroup);
    frozenCellsGroup.add(frozenCells);
    frozenGroup.add(frozenCellsGroup);

    const columnHeadGroup = new Konva.Group();
    columnHeadGroup.add(...columnHeads);

    const addFieldColumn = createAddFieldColumn(coordinateInstance, fields.length, columnStopIndex);
    if (addFieldColumn) {
        columnHeadGroup.add(addFieldColumn);
    }

    const cellsGroup = new Konva.Group();
    commonGroup.add(columnHeadGroup);
    cellsGroup.add(cells);
    commonGroup.add(cellsGroup);

    const attachGroup = new Konva.Group();
    attachGroup.add(...frozenPlaceHolderCells);
    frozenActivatedCell && attachGroup.add(frozenActivatedCell);
    frozenActiveCellBorder && attachGroup.add(frozenActiveCellBorder);
    attachGroup.add(...placeHolderCells);
    activatedCell && attachGroup.add(activatedCell);
    activeCellBorder && attachGroup.add(activeCellBorder);
    gridGroup.add(attachGroup);

    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);
    return gridStage;
};
