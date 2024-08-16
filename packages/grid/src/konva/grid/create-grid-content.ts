import { Group } from 'konva/lib/Group';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_ICON_COMMON_SIZE } from '../constants/grid';
import { AITableUseGrid } from '../interface/view';
import { createCells } from './create-cells';
import { createHeads } from './create-heads';
import { Rect } from 'konva/lib/shapes/Rect';
import { DefaultTheme } from '../constants/default-theme';
import { Icon } from '../components/icon';
import { AddOutlinedPath } from '../constants/icon';
import { Text } from 'konva/lib/shapes/Text';
import { Shape } from 'konva/lib/Shape';

export const createGridContent = (config: AITableUseGrid) => {
    const { aiTable, fields, records, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, scrollState, linearRows } =
        config;

    /**
     * Field header
     */
    const { frozenFieldHead, fieldHeads } = createHeads({
        aiTable,
        fields,
        records,
        instance,
        columnStartIndex,
        columnStopIndex,
        scrollState
    });

    /**
     * Static cells
     */
    const { frozenCells, cells } = createCells({
        aiTable,
        fields,
        records,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        linearRows
    });

    function getFieldButton() {
        const columnLength = fields.length;
        if (columnStopIndex !== columnLength - 1) return;
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
            stroke: DefaultTheme.colors.sheetLineColor,
            strokeWidth: 1,
            listening: true
        });

        const addIcon = Icon({
            x: offsetX,
            y: offsetY,
            size: 16,
            backgroundHeight: 16,
            data: AddOutlinedPath,
            fill: DefaultTheme.colors.thirdLevelText,
            listening: false
        });

        btnGroup.add(react);
        btnGroup.add(addIcon);
        return btnGroup;
    }

    const addFieldBtn = getFieldButton();

    return {
        frozenFieldHead,
        fieldHeads,
        frozenCells,
        cells,
        addFieldBtn
    };
};
