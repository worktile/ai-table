import Konva from 'konva';
import { Icon } from '../components/icon';
import { AddOutlinedPath, DefaultTheme, GRID_FIELD_ADD_BUTTON, GRID_ICON_COMMON_SIZE } from '../constants';
import { AITableUseGrid } from '../interface/view';
import { generateTargetName } from '../utils/helper';
import { createCells } from './create-cells';
import { createHeads } from './create-heads';

export const createGridContent = (config: AITableUseGrid) => {
    const { context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, scrollState } = config;
    const { columnCount, rowInitSize } = instance;
    const { fields } = context;

    /**
     * Field header
     */
    const { frozenFieldHead, fieldHeads } = createHeads({
        context,
        instance,
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
        columnStopIndex
    });

    const addFieldBtn = () => {
        if (columnStopIndex !== columnCount - 1) return;
        const field = fields[columnStopIndex];
        const fieldId = field._id;
        const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
        const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
        const x = lastColumnOffset + lastColumnWidth;
        const btnWidth = 100;
        const offsetX = (btnWidth - GRID_ICON_COMMON_SIZE) / 2;
        const offsetY = (rowInitSize - GRID_ICON_COMMON_SIZE) / 2;

        const group = new Konva.Group({ x });
        const rect = new Konva.Rect({
            x: 0.5,
            y: 0.5,
            width: btnWidth + 1,
            height: 8,
            fill: DefaultTheme.colors.lowestBg,
            listening: false
        });
        const rect1 = new Konva.Rect({
            name: generateTargetName({
                targetName: GRID_FIELD_ADD_BUTTON,
                fieldId,
                mouseStyle: 'pointer'
            }),
            x: 0.5,
            y: 0.5,
            width: btnWidth,
            height: rowInitSize,
            cornerRadius: [0, 8, 0, 0],
            stroke: DefaultTheme.colors.sheetLineColor,
            strokeWidth: 1,
            listening: true
        });
        const icon = Icon({
            x: offsetX,
            y: offsetY,
            data: AddOutlinedPath,
            fill: DefaultTheme.colors.thirdLevelText,
            listening: false
        });
        group.add(rect, rect1, icon);
        return group;
    };

    return {
        frozenFieldHead,
        fieldHeads,
        frozenCells,
        cells,
        addFieldBtn: addFieldBtn()
    };
};
