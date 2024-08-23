import { Layer } from 'konva/lib/Layer';
import { AITableGridStageOptions } from '../types';
import { Stage } from 'konva/lib/Stage';
import { Group } from 'konva/lib/Group';

export const createGridStage = (config: AITableGridStageOptions) => {
    const gridStage = new Stage({
        container: config.container,
        width: config.width,
        height: config.height,
        listening: false
    });
    const gridLayer = new Layer();
    const gridGroup = new Group();

    const frozenGroup = new Group();
    const commonGroup = new Group();
    gridGroup.add(frozenGroup);
    gridGroup.add(commonGroup);
    const frozenFieldHeadGroup = new Group();

    const frozenCellsGroup = new Group();
    frozenGroup.add(frozenFieldHeadGroup);
    frozenGroup.add(frozenCellsGroup);
    const FieldHeadGroup = new Group();
    const CellsGroup = new Group();
    commonGroup.add(FieldHeadGroup);
    commonGroup.add(CellsGroup);
    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);

    return gridStage;
};
