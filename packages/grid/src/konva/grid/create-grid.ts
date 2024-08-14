import Konva from 'konva';
import { GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AITableUseGrid } from '../interface/view';
import { createGridContent } from './create-grid-content';

export const createGrid = (config: AITableUseGrid) => {
    const {
        aiTable,
        fields,
        records,
        instance,
        scrollState,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        offsetX = 0
    } = config;

    const { fieldHeads, frozenFieldHead, frozenCells, cells } = createGridContent({
        aiTable,
        fields,
        records,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        scrollState
    });

    const { scrollTop, scrollLeft } = scrollState;
    const { frozenColumnWidth, containerWidth, containerHeight, rowInitSize } = instance;
    const frozenAreaWidth = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
    const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
    const cellGroupClipWidth = Math.min(
        containerWidth - frozenAreaWidth,
        lastColumnOffset + lastColumnWidth - scrollLeft - frozenAreaWidth
    );

    const layer = new Konva.Layer();
    const group = new Konva.Group();
    const group2 = new Konva.Group({
        clipX: offsetX,
        clipY: 0,
        clipWidth: containerWidth - offsetX,
        clipHeight: containerHeight
    });
    const group3 = new Konva.Group({
        x: offsetX
    });
    const group4 = new Konva.Group({
        offsetY: scrollTop
    });
    const group5 = new Konva.Group({
        clipX: frozenAreaWidth + 1,
        clipY: 0,
        clipWidth: cellGroupClipWidth,
        clipHeight: containerHeight
    });
    const group6 = new Konva.Group({
        offsetX: scrollLeft,
        offsetY: scrollTop
    });
    const group7 = new Konva.Group({
        offsetX: scrollLeft
    });
    group6.add(cells);
    group7.add(...fieldHeads);
    group5.add(group6);
    group5.add(group7);

    group4.add(frozenCells);

    group3.add(group4);
    const frozenFieldHeads = frozenFieldHead();
    group3.add(...frozenFieldHeads);
    group3.add(group5);

    const group8 = new Konva.Group({
        clipX: frozenAreaWidth - 1,
        clipY: rowInitSize - 1,
        clipWidth: containerWidth - frozenAreaWidth,
        clipHeight: containerHeight - rowInitSize
    });
    const group9 = new Konva.Group({
        offsetX: scrollLeft,
        offsetY: scrollTop
    });
    group8.add(group9);
    group3.add(group8);

    const group10 = new Konva.Group({
        clipX: 0,
        clipY: rowInitSize - 1,
        clipWidth: frozenAreaWidth + 4,
        clipHeight: containerHeight - rowInitSize
    });
    const group11 = new Konva.Group({
        offsetY: scrollTop
    });
    group10.add(group11);

    group2.add(group3);
    group.add(group2);

    layer.add(group);
    return layer;
};
