import Konva from 'konva';
import { Check, DEFAULT_ICON_BACKGROUND, DEFAULT_ICON_FILL, DEFAULT_ICON_SHAPE, DEFAULT_ICON_SIZE, Unchecked } from '../constants';
import { AITableCheckType, AITableIconOptions } from '../types';

export const createIcon = (config: AITableIconOptions) => {
    const {
        name,
        data,
        type,
        shape = DEFAULT_ICON_SHAPE,
        x,
        y,
        size = DEFAULT_ICON_SIZE,
        fill = DEFAULT_ICON_FILL,
        stroke,
        background = DEFAULT_ICON_BACKGROUND,
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

    const path = new Konva.Path({
        // x: (size * (scaleX || 1)) / 2,
        // y: (size * (scaleY || 1)) / 2,
        data: type && type === AITableCheckType.checked ? Check : type && type === AITableCheckType.unchecked ? Unchecked : data,
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
