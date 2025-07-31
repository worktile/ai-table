import { AITable } from '@ai-table/grid';

export enum AITableStateI18nKey {
    copyField = 'copyField',
    removeRecords = 'removeRecords',
    copy = 'copy',
    copySuffix = 'copySuffix',
    paste = 'paste',
    invalidPasteContent = 'invalidPasteContent',
    tableView = 'tableView',
    editField = 'editField',
    removeField = 'removeField',
    pasteOverMaxRecords = 'pasteOverMaxRecords',
    pasteOverMaxFields = 'pasteOverMaxFields',
    insertUpward = 'insertUpward',
    insertDownward = 'insertDownward',
    upward = 'upward',
    downward = 'downward',
    freezeToThisColumn = 'freezeToThisColumn',
    restoreDefaultFrozenColumn = 'restoreDefaultFrozenColumn'
}

export const AITableStateI18nText = {
    [AITableStateI18nKey.copyField]: '复制列',
    [AITableStateI18nKey.removeRecords]: '删除行',
    [AITableStateI18nKey.copy]: '复制',
    [AITableStateI18nKey.copySuffix]: '副本',
    [AITableStateI18nKey.paste]: '粘贴',
    [AITableStateI18nKey.invalidPasteContent]: '粘贴内容不符合当前类型',
    [AITableStateI18nKey.tableView]: '表格视图',
    [AITableStateI18nKey.editField]: '编辑列',
    [AITableStateI18nKey.removeField]: '删除列',
    [AITableStateI18nKey.pasteOverMaxRecords]: '粘贴数据超过最大行数',
    [AITableStateI18nKey.pasteOverMaxFields]: '粘贴数据超过最大列数',
    [AITableStateI18nKey.insertUpward]: '向上插入',
    [AITableStateI18nKey.insertDownward]: '向下插入',
    [AITableStateI18nKey.upward]: '行',
    [AITableStateI18nKey.downward]: '行',
    [AITableStateI18nKey.freezeToThisColumn]: '冻结至此列',
    [AITableStateI18nKey.restoreDefaultFrozenColumn]: '恢复默认冻结列'
};

export const getDefaultI18nTextByKey = (key: AITableStateI18nKey): string => {
    return AITableStateI18nText[key] || key;
};

export const getStateI18nTextByKey = (aiTable: AITable, key: AITableStateI18nKey | string): string => {
    if (aiTable.getI18nTextByKey) {
        const customText = aiTable.getI18nTextByKey(key);
        if (customText) {
            return customText;
        }
    }
    const defaultText = getDefaultI18nTextByKey(key as AITableStateI18nKey);
    return defaultText;
};
