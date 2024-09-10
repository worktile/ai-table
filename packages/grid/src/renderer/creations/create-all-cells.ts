import Konva from 'konva';
import { AITableCellsOptions } from '../../types';
import { createCells } from './create-cells';

export const createAllCells = (options: AITableCellsOptions) => {
    const { coordinate, columnStartIndex, columnStopIndex } = options;
    const { frozenColumnCount } = coordinate;

    // 冻结列
    const frozenCells = new Konva.Shape({
        listening: false,
        perfectDrawEnabled: false,
        sceneFunc: (ctx: Konva.Context) =>
            createCells({
                ...options,
                ctx,
                columnStartIndex: 0,
                columnStopIndex: frozenColumnCount - 1
            })
    });

    // 非冻结列
    const cells = new Konva.Shape({
        listening: false,
        perfectDrawEnabled: false,
        sceneFunc: (ctx: Konva.Context) =>
            createCells({
                ...options,
                ctx,
                columnStartIndex: Math.max(columnStartIndex, frozenColumnCount),
                columnStopIndex
            })
    });

    return {
        frozenCells,
        cells
    };
};
