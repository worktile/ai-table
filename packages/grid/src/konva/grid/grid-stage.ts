import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { DEFAULT_POINT_POSITION, GRID_BLANK, GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../constants';
import { gridMouseEvent } from '../core/mouse-event';
import { AITableKonvaGridStage } from '../interface/view';
import { getTargetName } from '../utils/helper';
import { createGrid } from './create-grid';

export const getCellOffsetLeft = (depth: number) => {
    if (!depth) return 0;
    if (depth > 1) return (depth - 1) * GRID_GROUP_OFFSET;
    return 0;
};

export const isWithinFrozenColumnBoundary = (x: number, depth: number, frozenColumnWidth: number) => {
    const offset = getCellOffsetLeft(depth);
    const max = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    const min = GRID_ROW_HEAD_WIDTH + offset;
    return x > min && x < max;
};

Konva.pixelRatio = 2;

export const createGridStage = (config: AITableKonvaGridStage) => {
    const { context, instance, offsetX = 0 } = config;
    const { scrollState, linearRows, setPointPosition } = context;
    const { scrollTop, scrollLeft } = scrollState;
    const { rowCount, columnCount, frozenColumnCount, containerWidth, containerHeight, frozenColumnWidth } = instance;

    // 获取要渲染的垂直可见区域
    const getVerticalRangeInfo = () => {
        const startIndex = instance.getRowStartIndex(scrollTop!);
        const stopIndex = instance.getRowStopIndex(startIndex, scrollTop!);

        return {
            rowStartIndex: Math.max(0, startIndex),
            rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex))
        };
    };

    // 获取要渲染的水平可见区域
    const getHorizontalRangeInfo = () => {
        const startIndex = instance.getColumnStartIndex(scrollLeft!);
        const stopIndex = instance.getColumnStopIndex(startIndex, scrollLeft!);

        return {
            columnStartIndex: Math.max(frozenColumnCount - 1, startIndex),
            columnStopIndex: Math.max(frozenColumnCount - 1, Math.min(columnCount - 1, stopIndex))
        };
    };

    const { rowStartIndex, rowStopIndex } = getVerticalRangeInfo();
    const { columnStartIndex, columnStopIndex } = getHorizontalRangeInfo();

    const getMousePosition = (x: number, y: number, _targetName?: string) => {
        if (x < offsetX) {
            return DEFAULT_POINT_POSITION;
        }
        const offsetTop = scrollTop! + y;
        const rowIndex = instance.getRowStartIndex(offsetTop);
        const depth = linearRows[rowIndex]?.depth;
        const realX = x - offsetX;
        const offsetLeft = isWithinFrozenColumnBoundary(realX, depth, frozenColumnWidth) ? realX : scrollLeft! + realX;
        const columnIndex = instance.getColumnStartIndex(offsetLeft);
        const targetName = getTargetName(_targetName);
        return {
            targetName, // As a simple operational identifier, with prefix name only
            realTargetName: _targetName || GRID_BLANK, // Real name
            rowIndex,
            columnIndex,
            offsetTop,
            offsetLeft,
            x: realX,
            y
        };
    };

    const setImmediatePointPosition = (e: KonvaEventObject<MouseEvent>) => {
        const targetName = e.target.name();
        const pos = e.target.getStage()!.getPointerPosition();
        if (pos == null) return;
        const { x, y } = pos;
        const curMousePosition = getMousePosition(x, y, targetName);
        setPointPosition(curMousePosition);
    };

    const {
        onTap,
        onClick,
        onMouseUp,
        onMouseDown,
        handleMouseStyle,
        onMouseMove: onGridMouseMove
    } = gridMouseEvent({
        context,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        offsetX,
        getMousePosition,
        scrollTop
    });

    const stage = new Konva.Stage({
        container: config.container,
        width: containerWidth,
        height: containerHeight,
        listening: true,
        draggable: false
    });

    /**
     * 处理鼠标移动事件
     */
    let wheelingRef: number | null = null;
    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (wheelingRef) return;
        wheelingRef = window.requestAnimationFrame(() => {
            const targetName = e.target.name();
            const pos = stage?.getPointerPosition();
            if (pos == null) return;
            const { x, y } = pos;
            const curMousePosition = getMousePosition(x, y, targetName);
            // 处理鼠标样式
            handleMouseStyle(curMousePosition.realTargetName);
            onGridMouseMove(e);
            setPointPosition(curMousePosition);
            wheelingRef = null;
        });
    };

    stage.on('mousedown', (e: KonvaEventObject<MouseEvent>) => {
        setImmediatePointPosition(e);
        onMouseDown(e);
    });
    stage.on('mouseup', (e: KonvaEventObject<MouseEvent>) => {
        onMouseUp(e);
    });
    stage.on('mousemove', (e: KonvaEventObject<MouseEvent>) => {
        onMouseMove(e);
    });
    stage.on('click', (e: KonvaEventObject<MouseEvent>) => {
        onClick(e);
    });
    stage.on('tap', (e: KonvaEventObject<MouseEvent>) => {
        onTap(e);
    });

    const grid = createGrid({
        context,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        offsetX
    });
    stage.add(grid);

    return stage;
};
