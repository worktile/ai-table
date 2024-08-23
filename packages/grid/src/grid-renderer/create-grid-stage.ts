import { Layer } from 'konva/lib/Layer';
import { AITableGridStageOptions } from '../types';
import { Stage } from 'konva/lib/Stage';

export const createGridStage = (config: AITableGridStageOptions) => {
    const gridStage = new Stage({
        container: config.container,
        width: config.width,
        height: config.height
    });
    const gridLayer = new Layer();
    gridStage.add(gridLayer);

    return gridStage;
};
