import { AITableFieldType } from '@ai-table/grid';
import { Icon } from '../../components/icon';
import {
    ColumnCalendarFilledPath,
    ColumnCreatedAtFilledPath,
    ColumnCreatedByFilledPath,
    ColumnLinkOutlinedPath,
    ColumnMemberFilledPath,
    ColumnNumberFilledPath,
    ColumnProgressFilledPath,
    ColumnRatingFilledPath,
    ColumnSelectFilledPath,
    ColumnTextFilledPath,
    ColumnUpdatedAtFilledPath,
    ColumnUpdatedByFilledPath
} from '../../constants/icon';

interface AITableFieldIconConfig {
    fieldType: AITableFieldType;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
}

export const FieldIcon = (config: AITableFieldIconConfig) => {
    const { fieldType, x, y, width, height, fill } = config;

    let data = null;

    switch (fieldType) {
        case AITableFieldType.text:
            data = ColumnTextFilledPath;
            break;
        case AITableFieldType.select:
            data = ColumnSelectFilledPath;
            break;
        case AITableFieldType.date:
            data = ColumnCalendarFilledPath;
            break;
        case AITableFieldType.number:
            data = ColumnNumberFilledPath;
            break;
        case AITableFieldType.link:
            data = ColumnLinkOutlinedPath;
            break;
        case AITableFieldType.rate:
            data = ColumnRatingFilledPath;
            break;
        case AITableFieldType.member:
            data = ColumnMemberFilledPath;
            break;
        case AITableFieldType.progress:
            data = ColumnProgressFilledPath;
            break;
        case AITableFieldType.createdAt:
            data = ColumnCreatedAtFilledPath;
            break;
        case AITableFieldType.updatedAt:
            data = ColumnUpdatedAtFilledPath;
            break;
        case AITableFieldType.createdBy:
            data = ColumnCreatedByFilledPath;
            break;
        case AITableFieldType.updatedBy:
            data = ColumnUpdatedByFilledPath;
            break;
    }

    return Icon({
        x,
        y,
        size: width,
        backgroundHeight: height,
        listening: false,
        data,
        fill
    });
};
