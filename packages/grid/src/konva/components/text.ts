import Konva from 'konva';
import { DefaultTheme } from '../constants/default-theme';

export const Text = (config: Konva.ShapeConfig) => {
    const colors = DefaultTheme.color;
    const {
        x,
        y,
        width,
        height,
        text,
        padding,
        align = 'left',
        verticalAlign = 'middle',
        fill = colors.firstLevelText,
        textDecoration,
        fontSize = 13,
        fontStyle = 'normal',
        ellipsis = true,
        wrap = 'none',
        transformsEnabled = 'position',
        listening = false,
        fontFamily = `'Segoe UI', Roboto, 'Helvetica Neue', Arial,
                  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        ...rest
    } = config;

    return new Konva.Text({
        x,
        y,
        width,
        height,
        text,
        padding,
        align,
        verticalAlign,
        fill,
        textDecoration,
        fontSize,
        fontStyle,
        ellipsis,
        wrap,
        transformsEnabled,
        listening,
        fontFamily,
        ...rest
    });
};
