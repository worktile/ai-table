import { AITableDynamicCellsOptions, AITablePlaceholderDrawerOptions } from '../../types';
import { createActiveCell } from './cell/active';
import { getPlaceHolderCellsByColumnIndex } from './cell/placeholder';

export const createDynamicCells = (options: AITableDynamicCellsOptions) => {
    const { aiTable, context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = options;
    const { frozenColumnCount } = instance;

    const placeholderOptions: Omit<AITablePlaceholderDrawerOptions, 'columnStartIndex' | 'columnStopIndex'> = {
        aiTable,
        context,
        instance,
        rowStartIndex,
        rowStopIndex
    };
    const frozenPlaceHolderCells = getPlaceHolderCellsByColumnIndex({
        ...placeholderOptions,
        columnStartIndex: 0,
        columnStopIndex: frozenColumnCount - 1
    });
    const placeHolderCells = getPlaceHolderCellsByColumnIndex({
        ...placeholderOptions,
        columnStartIndex,
        columnStopIndex
    });

    const { activatedCell, activeCellBorder, frozenActivatedCell, frozenActiveCellBorder } = createActiveCell({
        aiTable,
        context,
        instance,
        columnStartIndex,
        columnStopIndex,
        rowStartIndex,
        rowStopIndex
    });

    return {
        placeHolderCells,
        frozenPlaceHolderCells,
        activatedCell,
        activeCellBorder,
        frozenActivatedCell,
        frozenActiveCellBorder
    };
};
