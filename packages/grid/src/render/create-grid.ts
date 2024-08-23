import { Layer } from 'konva/lib/Layer';
import { AITableGridConfig } from '../types';
import { Stage } from 'konva/lib/Stage';

export const createGrid = (config: AITableGridConfig) => {
    const gridStage = new Stage({
        container: config.container,
        width: config.width,
        height: config.height
    });
    const gridLayer = new Layer();
    gridStage.add(gridLayer);
    return gridStage;
};
