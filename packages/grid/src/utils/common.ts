import { AITableTargetNameOptions } from '../types';

/**
 * 生成目标名称
 */
export const generateTargetName = ({ targetName, fieldId, recordId, mouseStyle }: AITableTargetNameOptions) => {
    const flag = '$';
    return `${targetName}.${fieldId || flag}.${recordId || flag}.${mouseStyle || flag}`;
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
