import Konva from 'konva/lib';
import { AITableGridStageOptions } from '../types';
import { AITable, Coordinate } from '../core';
import { AI_TABLE_DEFAULT_COLUMN_WIDTH, AI_TABLE_FIELD_HEAD_HEIGHT, AI_TABLE_ROW_HEAD_WIDTH } from '../constants';
import { getColumnIndicesMap, getVisibleRangeInfo } from '../utils';
import { createHeads } from './create-heads';

export const createGridStage = (config: AITableGridStageOptions) => {
    const { width, height, container, aiTable, linearRows } = config;

    const coordinateInstance = new Coordinate({
        rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
        columnWidth: AI_TABLE_DEFAULT_COLUMN_WIDTH,
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
    const { fieldHeads, frozenFieldHead } = createHeads({
        instance: coordinateInstance,
        columnStartIndex,
        columnStopIndex,
        fields: aiTable.fields()
    });

    const frozenGroup = new Konva.Group();
    const commonGroup = new Konva.Group();
    gridGroup.add(frozenGroup);
    gridGroup.add(commonGroup);
    const frozenFieldHeadGroup = new Konva.Group();
    frozenFieldHeadGroup.add(...frozenFieldHead);
    const frozenCellsGroup = new Konva.Group();
    frozenGroup.add(frozenFieldHeadGroup);
    frozenGroup.add(frozenCellsGroup);
    const fieldHeadGroup = new Konva.Group();
    fieldHeadGroup.add(...fieldHeads);
    const cellsGroup = new Konva.Group();
    commonGroup.add(fieldHeadGroup);
    commonGroup.add(cellsGroup);
    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);
    return gridStage;
};
