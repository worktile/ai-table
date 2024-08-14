import { AITableUseGrid } from '../interface/view';
import { createCells } from './create-cells';
import { createHeads } from './create-heads';

export const createGridContent = (config: AITableUseGrid) => {
    const { aiTable, fields, records, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, scrollState } = config;

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
        columnStopIndex
    });

    return {
        frozenFieldHead,
        fieldHeads,
        frozenCells,
        cells
    };
};
