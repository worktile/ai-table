import { AITable } from '@ai-table/grid';
import { Group } from 'konva/lib/Group';
import { Rect } from 'konva/lib/shapes/Rect';
import { Icon } from '../components/icon';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_ICON_COMMON_SIZE } from '../constants/grid';
import { AddOutlinedPath } from '../constants/icon';
import { AITableUseGrid } from '../interface/view';
import { createCells } from './create-cells';
import { createDynamicCells } from './create-dynamic-cells';
import { createHeads } from './create-heads';

export const createGridContent = (config: AITableUseGrid) => {
    const { context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, scrollState, linearRows } = config;
    const { aiTable, fields } = context;

    /**
     * Field header
     */
    const { frozenFieldHead, fieldHeads } = createHeads({
        context,
        instance,
        linearRows,
        columnStartIndex,
        columnStopIndex,
        scrollState
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
        columnStopIndex,
        linearRows
    });

    function getFieldButton() {
        const columnLength = fields().length;
        if (columnStopIndex !== columnLength - 1) return;
        const colors = AITable.getThemeColors(aiTable());
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
            cornerRadius: [0, 0],
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
    }

    const addFieldBtn = getFieldButton();

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
        linearRows,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        scrollState
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
