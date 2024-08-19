import Konva from 'konva';
import { DefaultTheme } from '../constants/default-theme';

export enum AITableIconType {
    unchecked = 'unchecked',
    checked = 'checked'
}

const dataMap = {
    [AITableIconType.unchecked]: `
    M12.2,1H2.8C1.8,1,1,1.8,1,2.8v9.5c0,1,0.8,1.8,1.8,1.8h9.5c1,0,1.8-0.8,1.8-1.8V2.8C14,1.8,13.2,1,12.2,1z
    M12.5,12.2c0,0.1-0.1,0.2-0.2,0.2H2.8c-0.1,0-0.2-0.1-0.2-0.2V2.8c0-0.1,0.1-0.2,0.2-0.2h9.5c0.1,0,0.2,0.1,0.2,0.2V12.2z
  `,
    [AITableIconType.checked]: `
    M13,1H2C1.4,1,1,1.4,1,2v11c0,0.6,0.4,1,1,1h11c0.6,0,1-0.4,1-1V2C14,1.4,13.6,1,13,1z M11.6,6l-4.3,4.2
    c-0.1,0.1-0.3,0.2-0.5,0.2c-0.2,0-0.4-0.1-0.5-0.2L3.5,7.4c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.3,2.3l3.7-3.7
    c0.3-0.3,0.8-0.3,1.1,0C11.9,5.2,11.9,5.7,11.6,6z
  `
};

interface AITableIconConfig extends Konva.ShapeConfig {
    type?: AITableIconType;
    size?: number;
    backgroundWidth?: number;
    backgroundHeight?: number;
}

export type Shape = 'square' | 'circle';

export const Icon = (config: AITableIconConfig & { id?: string; background?: string; shape?: Shape }) => {
    const colors = DefaultTheme.color;
    const {
        name,
        data,
        type,
        shape = 'square',
        x,
        y,
        size = 16,
        backgroundWidth,
        backgroundHeight,
        fill = colors.thirdLevelText,
        stroke,
        background = 'transparent',
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

    if (shape === 'circle') {
        const circle = new Konva.Circle({
            x: (backgroundWidth || size) / 2,
            y: (backgroundWidth || size) / 2,
            name,
            radius: (backgroundWidth || size) / 2,
            fill: background,
            opacity,
            perfectDrawEnabled: false
        });
        group.add(circle);
    }
    if (shape === 'square') {
        const rect = new Konva.Rect({
            name,
            width: backgroundWidth || size,
            height: backgroundHeight || size,
            fill: background,
            cornerRadius,
            opacity
        });
        group.add(rect);
    }

    const path = new Konva.Path({
        x: backgroundWidth && (backgroundWidth - size * (scaleX || 1)) / 2,
        y: backgroundHeight && (backgroundHeight - size * (scaleY || 1)) / 2,
        data: type ? dataMap[type] : data,
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
