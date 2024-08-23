import { ColumnTextFilledPath } from '../constants';
import { AITableFieldType } from '../core';
import { AITableFieldTypeIconOptions } from '../types';
import { createIcon } from './icon';

export const createFieldIcon = (options: AITableFieldTypeIconOptions) => {
    const { fieldType, x, y, width, height, fill } = options;

    let data = null;

    switch (fieldType) {
        case AITableFieldType.text:
            data = ColumnTextFilledPath;
            break;
    }

    return createIcon({
        x,
        y,
        size: width,
        backgroundHeight: height,
        listening: false,
        data,
        fill
    });
};
