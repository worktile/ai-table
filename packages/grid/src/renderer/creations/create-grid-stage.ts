import Konva from 'konva/lib';
import { AI_TABLE_FIELD_ADD_BUTTON_WIDTH, AI_TABLE_ROW_HEAD_WIDTH } from '../../constants';
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
    const { frozenColumnWidth, rowInitSize } = coordinate;
    const { scrollLeft, scrollTop } = scrollState();
    const fields = AITable.getVisibleFields(aiTable);

    const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = getVisibleRangeInfo(coordinate, scrollState());
    const frozenAreaWidth = AI_TABLE_ROW_HEAD_WIDTH + frozenColumnWidth;
    const lastColumnWidth = coordinate.getColumnWidth(columnStopIndex);
    const lastColumnOffset = coordinate.getColumnOffset(columnStopIndex);
    const addFieldBtnWidth = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
    const cellGroupClipWidth = Math.min(
        width - frozenAreaWidth,
        addFieldBtnWidth + lastColumnOffset + lastColumnWidth - scrollLeft - frozenAreaWidth
    );

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
    const gridGroup = new Konva.Group({
        clipX: 0,
        clipY: 0,
        clipWidth: width,
        clipHeight: height
    });
    const frozenGroup = new Konva.Group({
        offsetY: scrollTop
    });
    const commonGroup = new Konva.Group({
        clipX: frozenAreaWidth + 1,
        clipY: 0,
        clipWidth: cellGroupClipWidth,
        clipHeight: height
    });
    const attachGroup = new Konva.Group({
        clipX: frozenAreaWidth - 1,
        clipY: rowInitSize - 1,
        clipWidth: width - frozenAreaWidth,
        clipHeight: height - rowInitSize
    });
    const frozenAttachGroup = new Konva.Group({
        clipX: 0,
        clipY: rowInitSize - 1,
        clipWidth: frozenAreaWidth + 4,
        clipHeight: height - rowInitSize
    });
    const cellsGroup = new Konva.Group({
        offsetY: scrollTop,
        offsetX: scrollLeft
    });
    const cellHeadGroup = new Konva.Group({
        offsetX: scrollLeft
    });
    const commonAttachContainerGroup = new Konva.Group({
        offsetX: scrollLeft,
        offsetY: scrollTop
    });
    const frozenActiveGroup = new Konva.Group({
        offsetY: scrollTop
    });

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
