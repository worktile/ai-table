import Konva from 'konva/lib';
import { AITableGridStageOptions } from '../types';
import { AITable, Coordinate } from '../core';
import { AI_TABLE_FIELD_HEAD_HEIGHT, AI_TABLE_ROW_HEAD_WIDTH } from '../constants';
import { getColumnIndicesMap, getVisibleRangeInfo } from '../utils';
import { createColumnHeads } from './create-heads';
import { createAddFieldColumn } from './create-add-field-column';

export const createGridStage = (config: AITableGridStageOptions) => {
    const { width, height, container, aiTable, linearRows } = config;
    const fields = AITable.getVisibleFields(aiTable);

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

    const frozenGroup = new Konva.Group();
    const commonGroup = new Konva.Group();
    gridGroup.add(frozenGroup);
    gridGroup.add(commonGroup);
    const frozenColumnHeadGroup = new Konva.Group();
    frozenColumnHeadGroup.add(...frozenColumnHead);
    const frozenCellsGroup = new Konva.Group();
    frozenGroup.add(frozenColumnHeadGroup);
    frozenGroup.add(frozenCellsGroup);
    const columnHeadGroup = new Konva.Group();
    columnHeadGroup.add(...columnHeads);
    const addFieldColumn = createAddFieldColumn(coordinateInstance, fields.length, columnStopIndex);
    columnHeadGroup.add(...columnHeads);

    if (addFieldColumn) {
        columnHeadGroup.add(addFieldColumn);
    }

    const cellsGroup = new Konva.Group();
    commonGroup.add(columnHeadGroup);
    commonGroup.add(cellsGroup);
    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);
    return gridStage;
};
