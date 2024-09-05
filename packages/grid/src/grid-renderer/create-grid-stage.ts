import Konva from 'konva/lib';
import { AITableGridStageOptions } from '../types';
import { AITable } from '../core';
import { getVisibleRangeInfo } from '../utils';
import { createColumnHeads } from './create-heads';
import { createAddFieldColumn } from './create-add-field-column';
import { createCells } from './create-cells';
import { hoverRowHeadOperation } from './create-row-head-operation';
import { createOtherRows } from './create-other-rows';

Konva.pixelRatio = 2;

export const createGridStage = (config: AITableGridStageOptions) => {
    const { width, height, container, aiTable, context, instance: coordinateInstance } = config;

    const fields = AITable.getVisibleFields(aiTable);

    const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = getVisibleRangeInfo(
        coordinateInstance,
        context.scrollState()
    );

    const gridStage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
        listening: true
    });

    const gridLayer = new Konva.Layer();
    const gridGroup = new Konva.Group();
    const { columnHeads, frozenColumnHead } = createColumnHeads({
        instance: coordinateInstance,
        columnStartIndex,
        columnStopIndex,
        fields: fields,
        pointPosition: context.pointPosition(),
        aiTable
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
    const rowHeadsOperations = hoverRowHeadOperation({
        aiTable,
        context,
        instance: coordinateInstance,
        rowStartIndex,
        rowStopIndex
    });

    const otherRows = createOtherRows({
        aiTable,
        context,
        instance: coordinateInstance,
        rowStartIndex,
        rowStopIndex
    });
    frozenCellsGroup.add(...rowHeadsOperations, ...otherRows);
    frozenGroup.add(frozenCellsGroup);
    const columnHeadGroup = new Konva.Group();
    columnHeadGroup.add(...columnHeads);
    const addFieldColumn = createAddFieldColumn(coordinateInstance, fields, columnStopIndex);
    if (addFieldColumn) {
        columnHeadGroup.add(addFieldColumn);
    }
    const cellsGroup = new Konva.Group();
    commonGroup.add(columnHeadGroup);
    cellsGroup.add(cells);
    commonGroup.add(cellsGroup);
    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);
    return gridStage;
};
