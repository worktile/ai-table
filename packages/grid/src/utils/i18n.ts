import { AITable } from '../core';

export enum AITableGridI18nKey {
    dataPickerPlaceholder = 'dataPickerPlaceholder',
    linkTooltip = 'linkTooltip',
    invalidLinkFormat = 'invalidLinkFormat' // 新增
}

const AITableI18nText = {
    [`${AITableGridI18nKey.dataPickerPlaceholder}`]: '选择日期',
    [`${AITableGridI18nKey.linkTooltip}`]: '链接',
    [`${AITableGridI18nKey.invalidLinkFormat}`]: '链接格式不正确' // 新增
};

export const getDefaultI18nTextByKey = (key: AITableGridI18nKey): string => {
    return AITableI18nText[key] || key;
};

export const getI18nTextByKey = (
    aiTable: AITable,
    key: AITableGridI18nKey | string
): string => {
    if (aiTable.getI18nTextByKey) {
        const customText = aiTable.getI18nTextByKey(key);
        if (customText) {
            return customText;
        }
    }
    const defaultText = getDefaultI18nTextByKey(key as AITableGridI18nKey);
    return defaultText;
};
