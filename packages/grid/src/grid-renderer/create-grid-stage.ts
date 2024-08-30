import Konva from 'konva/lib';
import { AI_TABLE_FIELD_HEAD_HEIGHT, AI_TABLE_ROW_HEAD_WIDTH } from '../constants';
import { AITable, Coordinate } from '../core';
import { AITableGridStageOptions } from '../types';
import { getColumnIndicesMap, getVisibleRangeInfo } from '../utils';
import { createCells } from './create-cells';
import { createColumnHeads } from './create-heads';

Konva.pixelRatio = 2;

export const createGridStage = (config: AITableGridStageOptions) => {
    const { aiTable, context, width, height, container } = config;
    const { linearRows } = context;

    const coordinateInstance = new Coordinate({
        rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
        rowCount: linearRows.length,
        columnCount: aiTable.fields().length,
        containerWidth: width,
        containerHeight: height,
        rowInitSize: AI_TABLE_FIELD_HEAD_HEIGHT,
        columnInitSize: AI_TABLE_ROW_HEAD_WIDTH,
        rowIndicesMap: {},
        columnIndicesMap: getColumnIndicesMap(AITable.getVisibleFields(aiTable)),
        frozenColumnCount: 1
    });

    const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = getVisibleRangeInfo(coordinateInstance, {
        scrollLeft: 0,
        scrollTop: 0
    });

    const gridStage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
        listening: false
    });

    const gridLayer = new Konva.Layer();
    const gridGroup = new Konva.Group();
    const { columnHeads, frozenColumnHead } = createColumnHeads({
        instance: coordinateInstance,
        columnStartIndex,
        columnStopIndex,
        fields: aiTable.fields()
    });

    const { frozenCells, cells } = createCells({
        aiTable,
        context,
        instance: coordinateInstance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

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
    const cellsGroup = new Konva.Group();
    commonGroup.add(columnHeadGroup);
    cellsGroup.add(cells);
    commonGroup.add(cellsGroup);
    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);
    return gridStage;
};
