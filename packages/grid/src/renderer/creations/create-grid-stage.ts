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
import { createPlaceHolderCells } from './create-placeholder-cells';

Konva.pixelRatio = 2;

export const createGridStage = (options: AITableGridStageOptions) => {
    const { aiTable, width, height, container, coordinate } = options;
    const { scrollState, pointPosition } = aiTable.context!;

    const fields = AITable.getVisibleFields(aiTable);

    const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = getVisibleRangeInfo(coordinate, scrollState());

    const { frozenColumnHead, columnHeads } = createColumnHeads({
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

    const frozenPlaceHolderCells = createPlaceHolderCells({
        aiTable,
        coordinate,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex: 0,
        columnStopIndex: coordinate.frozenColumnCount - 1
    });

    const placeHolderCells = createPlaceHolderCells({
        aiTable,
        coordinate,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

    const { frozenActiveCellBorder, activeCellBorder } = createActiveCellBorder({
        aiTable,
        coordinate,
        columnStartIndex,
        columnStopIndex,
        rowStartIndex,
        rowStopIndex
    });

    const addFieldBtn = createAddFieldColumn(coordinate, fields, columnStopIndex);

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
    const attachGroup = new Konva.Group();
    const frozenAttachGroup = new Konva.Group();
    const cellsGroup = new Konva.Group();
    const cellHeadGroup = new Konva.Group();
    const commonAttachContainerGroup = new Konva.Group();
    const frozenActiveGroup = new Konva.Group();

    gridStage.add(gridLayer);
    gridLayer.add(gridGroup);
    gridGroup.add(frozenGroup);

    frozenGroup.add(frozenCells);
    frozenGroup.add(...otherRows);
    frozenGroup.add(...hoverRowHeads);
    frozenPlaceHolderCells && frozenGroup.add(...frozenPlaceHolderCells);

    gridGroup.add(...frozenColumnHead);

    gridGroup.add(commonGroup);
    commonGroup.add(cellsGroup);
    cellsGroup.add(cells);
    commonGroup.add(cellHeadGroup);
    cellHeadGroup.add(...columnHeads);
    addFieldBtn && cellHeadGroup.add(addFieldBtn);

    gridGroup.add(attachGroup);
    attachGroup.add(commonAttachContainerGroup);
    placeHolderCells && commonAttachContainerGroup.add(...placeHolderCells);
    activeCellBorder && commonAttachContainerGroup.add(activeCellBorder);

    gridGroup.add(frozenAttachGroup);
    frozenAttachGroup.add(frozenActiveGroup);
    frozenActiveCellBorder && frozenActiveGroup.add(frozenActiveCellBorder);

    return gridStage;
};
