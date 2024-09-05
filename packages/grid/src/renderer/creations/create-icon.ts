import Konva from 'konva';
import { Check, Colors, DEFAULT_ICON_SHAPE, DEFAULT_ICON_SIZE, Unchecked } from '../../constants';
import { AITableCheckType, AITableIconOptions } from '../../types';

export const createIcon = (config: AITableIconOptions) => {
    const {
        name,
        data,
        type,
        shape = DEFAULT_ICON_SHAPE,
        x,
        y,
        size = DEFAULT_ICON_SIZE,
        fill = Colors.gray600,
        stroke,
        background = Colors.transparent,
        rotation,
        scaleX,
        scaleY,
        offsetX,
        offsetY,
        cornerRadius,
        opacity,
        listening,
        transformsEnabled = 'position',
        ...rest
    } = config;

    const group = new Konva.Group({
        ...rest,
        x,
        y,
        listening
    });

    if (shape === 'square') {
        const rect = new Konva.Rect({
            name,
            width: size,
            height: size,
            fill: background,
            cornerRadius,
            opacity
        });
        group.add(rect);
    }

    let pathData = data;

    switch (type) {
        case AITableCheckType.checked:
            pathData = Check;
            break;
        case AITableCheckType.unchecked:
            pathData = Unchecked;
            break;
    }
    const path = new Konva.Path({
        data: pathData,
        width: size,
        height: size,
        fill,
        offsetX,
        offsetY,
        scaleX,
        scaleY,
        rotation,
        stroke,
        transformsEnabled,
        perfectDrawEnabled: false,
        listening: false
    });
    group.add(path);

    return group;
};
