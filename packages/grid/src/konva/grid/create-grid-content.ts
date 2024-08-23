import { Group } from 'konva/lib/Group';
import { Rect } from 'konva/lib/shapes/Rect';
import { Icon } from '../components/icon';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_ICON_COMMON_SIZE } from '../constants/grid';
import { AddOutlinedPath } from '../constants/icon';
import { AIGrid } from '../interface/table';
import { AITableUseGrid } from '../interface/view';
import { createCells } from './create-cells';
import { createDynamicCells } from './create-dynamic-cells';
import { createHeads } from './create-heads';

export const createGridContent = (config: AITableUseGrid) => {
    const { context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = config;
    const { aiTable, fields, linearRows, scrollState } = context;
    const visibleColumns = AIGrid.getVisibleColumns(context);

    /**
     * Field header
     */
    const { frozenFieldHead, fieldHeads } = createHeads({
        context,
        instance,
        columnStartIndex,
        columnStopIndex
    });

    /**
     * Static cells
     */
    const { frozenCells, cells } = createCells({
        context,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

    /**
     * 添加行按钮
     */
    const addFieldBtn = (() => {
        const columnLength = visibleColumns.length;
        if (columnStopIndex !== columnLength - 1) return;
        const colors = AIGrid.getThemeColors(aiTable);
        const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
        const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
        const x = lastColumnOffset + lastColumnWidth;
        const btnWidth = GRID_ADD_FIELD_BUTTON_WIDTH;
        const offsetX = (btnWidth - GRID_ICON_COMMON_SIZE) / 2;
        const offsetY = (instance.rowInitSize - GRID_ICON_COMMON_SIZE) / 2;
        const btnGroup = new Group({ x });

        const react = new Rect({
            x: 0.5,
            y: 0.5,
            width: btnWidth,
            height: instance.rowInitSize,
            cornerRadius: [0, 8, 0, 0],
            stroke: colors.sheetLineColor,
            strokeWidth: 1,
            listening: true
        });

        const addIcon = Icon({
            x: offsetX,
            y: offsetY,
            size: 16,
            backgroundHeight: 16,
            data: AddOutlinedPath,
            fill: colors.thirdLevelText,
            listening: false
        });

        btnGroup.add(react);
        btnGroup.add(addIcon);
        return btnGroup;
    })();

    /**
     * Dynamic cells in active and hover states
     */
    const {
        activedCell,
        activeCellBorder,
        frozenActivedCell,
        frozenActiveCellBorder,
        fillHandler,
        frozenFillHandler,
        placeHolderCells,
        frozenPlaceHolderCells,
        draggingOutline,
        toggleEditing
    } = createDynamicCells({
        context,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    }) as any;

    return {
        frozenFieldHead,
        fieldHeads,
        frozenCells,
        cells,
        addFieldBtn,
        activedCell,
        activeCellBorder,
        frozenActivedCell,
        frozenActiveCellBorder,
        fillHandler,
        frozenFillHandler,
        placeHolderCells,
        frozenPlaceHolderCells,
        draggingOutline,
        toggleEditing
    };
};
