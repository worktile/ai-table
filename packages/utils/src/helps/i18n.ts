import { AITable } from '../types';

export enum AITableUtilsI18nKey {
    none = 'none',
    countAll = 'countAll',
    countAllResult = 'countAllResult',
    filled = 'filled',
    filledResult = 'filledResult',
    empty = 'empty',
    emptyResult = 'emptyResult',
    unique = 'unique',
    uniqueResult = 'uniqueResult',
    percentFilled = 'percentFilled',
    percentFilledResult = 'percentFilledResult',
    percentEmpty = 'percentEmpty',
    percentEmptyResult = 'percentEmptyResult',
    percentUnique = 'percentUnique',
    percentUniqueResult = 'percentUniqueResult',
    sum = 'sum',
    sumResult = 'sumResult',
    max = 'max',
    maxResult = 'maxResult',
    min = 'min',
    minResult = 'minResult',
    average = 'average',
    averageResult = 'averageResult',
    checked = 'checked',
    checkedResult = 'checkedResult',
    unChecked = 'unChecked',
    unCheckedResult = 'unCheckedResult',
    percentChecked = 'percentChecked',
    percentCheckedResult = 'percentCheckedResult',
    percentUnChecked = 'percentUnChecked',
    percentUnCheckedResult = 'percentUnCheckedResult'
}

export const AITableUtilsI18nText = {
    [AITableUtilsI18nKey.none]: '不展示',
    [AITableUtilsI18nKey.countAll]: '记录总数',
    [AITableUtilsI18nKey.countAllResult]: '{{statValue}} 条记录',
    [AITableUtilsI18nKey.filled]: '已填写数',
    [AITableUtilsI18nKey.filledResult]: '已填写 {{statValue}}',
    [AITableUtilsI18nKey.empty]: '未填写数',
    [AITableUtilsI18nKey.emptyResult]: '未填写 {{statValue}}',
    [AITableUtilsI18nKey.unique]: '唯一数',
    [AITableUtilsI18nKey.uniqueResult]: '唯一数 {{statValue}}',
    [AITableUtilsI18nKey.percentFilled]: '已填写占比',
    [AITableUtilsI18nKey.percentFilledResult]: '已填写 {{statValue}}%',
    [AITableUtilsI18nKey.percentEmpty]: '未填写占比',
    [AITableUtilsI18nKey.percentEmptyResult]: '未填写 {{statValue}}%',
    [AITableUtilsI18nKey.percentUnique]: '唯一占比',
    [AITableUtilsI18nKey.percentUniqueResult]: '唯一 {{statValue}}%',
    [AITableUtilsI18nKey.sum]: '求和',
    [AITableUtilsI18nKey.sumResult]: '求和 {{statValue}}',
    [AITableUtilsI18nKey.max]: '最大值',
    [AITableUtilsI18nKey.maxResult]: '最大值 {{statValue}}',
    [AITableUtilsI18nKey.min]: '最小值',
    [AITableUtilsI18nKey.minResult]: '最小值 {{statValue}}',
    [AITableUtilsI18nKey.average]: '平均值',
    [AITableUtilsI18nKey.averageResult]: '平均值 {{statValue}}',
    [AITableUtilsI18nKey.checked]: '已勾选',
    [AITableUtilsI18nKey.checkedResult]: '已勾选 {{statValue}}',
    [AITableUtilsI18nKey.unChecked]: '未勾选',
    [AITableUtilsI18nKey.unCheckedResult]: '未勾选 {{statValue}}',
    [AITableUtilsI18nKey.percentChecked]: '已选中占比',
    [AITableUtilsI18nKey.percentCheckedResult]: '已选中 {{statValue}}%',
    [AITableUtilsI18nKey.percentUnChecked]: '未选中占比',
    [AITableUtilsI18nKey.percentUnCheckedResult]: '未选中 {{statValue}}%'
};

export const getDefaultI18nTextByKey = (key: AITableUtilsI18nKey): string => {
    return AITableUtilsI18nText[key] || key;
};

export const getI18nTextByKey = (aiTable: AITable, key: AITableUtilsI18nKey | string): string => {
    if (aiTable.getI18nTextByKey) {
        const customText = aiTable.getI18nTextByKey(key);
        if (customText) {
            return customText;
        }
    }
    const defaultText = getDefaultI18nTextByKey(key as AITableUtilsI18nKey);
    return defaultText;
};
