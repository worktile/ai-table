import { AITable } from "@ai-table/grid";


export enum AITableStateI18nKey {
    copyFieldName = 'copyFieldName'
}

const AITableI18nText = {
    [`${AITableStateI18nKey.copyFieldName}`]: '复制列'
};

export const getDefaultI18nTextByKey = (key: AITableStateI18nKey): string => {
    return AITableI18nText[key] || key;
};

export const getStateI18nTextByKey = (
    aiTable: AITable,
    key: AITableStateI18nKey | string
): string => {
    if (aiTable.getI18nTextByKey) {
        const customText = aiTable.getI18nTextByKey(key);
        if (customText) {
            return customText;
        }
    }
    const defaultText = getDefaultI18nTextByKey(key as AITableStateI18nKey);
    return defaultText;
};
