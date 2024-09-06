import { AI_TABLE_BLANK } from '../constants';
import { AITableTargetNameOptions } from '../types';

/**
 * 生成目标名称
 */
export const generateTargetName = ({ targetName, fieldId, recordId, mouseStyle }: AITableTargetNameOptions) => {
    const flag = '$';
    return `${targetName}.${fieldId || flag}.${recordId || flag}.${mouseStyle || flag}`;
};

/**
 * Parse targetName for built-in information
 */
export const getDetailByTargetName = (_targetName: string | null) => {
    if (_targetName == null) {
        return {
            targetName: null,
            fieldId: null,
            recordId: null,
            mouseStyle: null
        };
    }

    const flag = '$';
    const [targetName, fieldId, recordId, mouseStyle] = _targetName.split('.');
    return {
        targetName,
        fieldId: fieldId === flag ? null : fieldId,
        recordId: recordId === flag ? null : recordId,
        mouseStyle: mouseStyle === flag ? null : mouseStyle
    };
};

export const getTargetName = (targetName?: string | null) => {
    if (targetName == null || targetName === '') return AI_TABLE_BLANK;
    return targetName.split('.')[0];
};

/**
 * 转换为字符串
 * @param value
 * @returns
 */
export const castToString = (value: string): string | null => {
    if (value == null) {
        return null;
    }
    return typeof value !== 'string' ? String(value) : value;
};
