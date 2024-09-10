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
        backgroundWidth,
        backgroundHeight,
        fill = Colors.gray600,
        stroke,
        strokeWidth = 1,
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
            width: backgroundWidth || size,
            height: backgroundHeight || size,
            strokeWidth,
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
        x: backgroundWidth && (backgroundWidth - size * (scaleX || 1)) / 2,
        y: backgroundHeight && (backgroundHeight - size * (scaleY || 1)) / 2,
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
        strokeWidth,
        transformsEnabled,
        perfectDrawEnabled: false,
        listening: false
    });
    group.add(path);

    return group;
};
