import {
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_OPACITY_LINE,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_FILL_HANDLE,
    AI_TABLE_ROW_ADD_BUTTON,
    AI_TABLE_ROW_DRAG,
    AI_TABLE_ROW_SELECT_CHECKBOX
} from '../constants';
import { AITableAreaType } from '../types';
import { getDetailByTargetName } from './common';

export const handleMouseStyle = (
    realTargetName: string,
    areaType: AITableAreaType = AITableAreaType.grid,
    container: HTMLDivElement,
    isReadOnly?: boolean
) => {
    const { targetName, mouseStyle } = getDetailByTargetName(realTargetName);
    if (mouseStyle) return setMouseStyle(mouseStyle, container);
    if (areaType === AITableAreaType.none) return setMouseStyle('default', container);

    switch (targetName) {
        case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX:
        case AI_TABLE_FIELD_HEAD_MORE:
        case AI_TABLE_ROW_SELECT_CHECKBOX:
        case AI_TABLE_ROW_ADD_BUTTON:
        case AI_TABLE_FIELD_ADD_BUTTON: {
            return setMouseStyle('pointer', container);
        }
        case AI_TABLE_FIELD_HEAD_OPACITY_LINE: {
            if (isReadOnly) {
                return setMouseStyle('default', container);
            }
            return setMouseStyle('col-resize', container);
        }
        case AI_TABLE_ROW_DRAG: {
            return setMouseStyle('pointer', container);
        }
        case AI_TABLE_FILL_HANDLE: {
            return setMouseStyle('crosshair', container);
        }

        default:
            return setMouseStyle('default', container);
    }
};

export const setMouseStyle = (mouseStyle: string, container: HTMLDivElement) => {
    container.style.cursor = mouseStyle;
};
