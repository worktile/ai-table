import Konva from 'konva/lib';
import { AITableGridStageOptions } from '../types';

export const createGridStage = (config: AITableGridStageOptions) => {
    const gridStage = new Konva.Stage({
        container: config.container,
        width: config.width,
        height: config.height,
        isDragging: false
    });
    const gridLayer = new Konva.Layer();
    gridStage.add(gridLayer);

    return gridStage;
};
