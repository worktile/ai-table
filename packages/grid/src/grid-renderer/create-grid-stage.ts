import Konva from 'konva/lib';
import { AITableGridStageOptions } from '../types';

export const createGridStage = (config: AITableGridStageOptions) => {
    const gridStage = new Konva.Stage({
        container: config.container,
        width: config.width,
        height: config.height,
        listening: false
    });
    const gridLayer = new Konva.Layer();
    const gridGroup = new Konva.Group();

    const frozenGroup = new Konva.Group();
    const commonGroup = new Konva.Group();
    gridGroup.add(frozenGroup);
    gridGroup.add(commonGroup);
    const frozenFieldHeadGroup = new Konva.Group();

    const frozenCellsGroup = new Konva.Group();
    frozenGroup.add(frozenFieldHeadGroup);
    frozenGroup.add(frozenCellsGroup);
    const FieldHeadGroup = new Konva.Group();
    const CellsGroup = new Konva.Group();
    commonGroup.add(FieldHeadGroup);
    commonGroup.add(CellsGroup);
    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);

    return gridStage;
};
