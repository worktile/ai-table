import Konva from 'konva/lib';
import { AITable } from '../../core';
import { AITableGridStageOptions } from '../../types';
import { getVisibleRangeInfo } from '../../utils';
import { createActiveCellBorder } from './create-active-cell-border';
import { createAddFieldColumn } from './create-add-field-column';
import { createAllCells } from './create-all-cells';
import { createColumnHeads } from './create-heads';
import { createHoverRowHeads } from './create-hover-row-heads';
import { createOtherRows } from './create-other-rows';
import { getPlaceHolderCellsByColumnIndex } from './create-placeholder-cell';

Konva.pixelRatio = 2;

export const createGridStage = (options: AITableGridStageOptions) => {
    const { aiTable, width, height, container, coordinate } = options;
    const { scrollState, pointPosition } = aiTable.context!;
    const fields = AITable.getVisibleFields(aiTable);

    const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = getVisibleRangeInfo(coordinate, scrollState());

    const { columnHeads, frozenColumnHead } = createColumnHeads({
        coordinate,
        columnStartIndex,
        columnStopIndex,
        fields: fields,
        pointPosition: pointPosition(),
        aiTable
    });

    const { frozenCells, cells } = createAllCells({
        aiTable,
        coordinate,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

    const frozenPlaceHolderCells = getPlaceHolderCellsByColumnIndex({
        aiTable,
        coordinate,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex: 0,
        columnStopIndex: coordinate.frozenColumnCount - 1
    });

    const placeHolderCells = getPlaceHolderCellsByColumnIndex({
        aiTable,
        coordinate,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

    const { activeCellBorder, frozenActiveCellBorder } = createActiveCellBorder({
        aiTable,
        coordinate,
        columnStartIndex,
        columnStopIndex,
        rowStartIndex,
        rowStopIndex
    });

    const gridStage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
        listening: true
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
    const hoverRowHeads = createHoverRowHeads({
        aiTable,
        coordinate,
        rowStartIndex,
        rowStopIndex
    });

    const otherRows = createOtherRows({
        aiTable,
        coordinate,
        rowStartIndex,
        rowStopIndex
    });
    frozenCellsGroup.add(...hoverRowHeads, ...otherRows);
    frozenGroup.add(frozenCellsGroup);

    const columnHeadGroup = new Konva.Group();
    columnHeadGroup.add(...columnHeads);
    const addFieldColumn = createAddFieldColumn(coordinate, fields, columnStopIndex);
    if (addFieldColumn) {
        columnHeadGroup.add(addFieldColumn);
    }

    const cellsGroup = new Konva.Group();
    commonGroup.add(columnHeadGroup);
    cellsGroup.add(cells);
    commonGroup.add(cellsGroup);

    const attachGroup = new Konva.Group();
    attachGroup.add(...frozenPlaceHolderCells);
    frozenActiveCellBorder && attachGroup.add(frozenActiveCellBorder);
    attachGroup.add(...placeHolderCells);
    activeCellBorder && attachGroup.add(activeCellBorder);
    gridGroup.add(attachGroup);

    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);
    return gridStage;
};
