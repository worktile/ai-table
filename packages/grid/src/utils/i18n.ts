import { AITable } from '../core';

export enum AITableGridI18nKey {
    dataPickerPlaceholder = 'dataPickerPlaceholder',
    linkTooltip = 'linkTooltip',
    invalidLinkFormat = 'invalidLinkFormat',
    linkRequired = 'linkRequired',
    linkText = 'linkText',
    linkUrl = 'linkUrl',
    inputText = 'inputText',
    inputUrl = 'inputUrl',
    fieldColumnName = 'fieldColumnName',
    fieldColumnNamePlaceholder = 'fieldColumnNamePlaceholder',
    fieldType = 'fieldType',
    allowMultipleMembers = 'allowMultipleMembers',
    cancel = 'cancel',
    apply = 'apply',
    fieldNameRequired = 'fieldNameRequired',
    fieldNameDuplicate = 'fieldNameDuplicate',
    confirm = 'confirm',
    copiedCells = 'copiedCells',
    invalidPasteContent = 'invalidPasteContent', // 新增
    pasteOverMaxRecords = 'pasteOverMaxRecords',
    pasteOverMaxFields = 'pasteOverMaxFields',
    fieldTypeText = 'fieldTypeText',
    fieldTypeRichText = 'fieldTypeRichText',
    fieldTypeSelect = 'fieldTypeSelect',
    fieldTypeMultiSelect = 'fieldTypeMultiSelect',
    fieldTypeNumber = 'fieldTypeNumber',
    fieldTypeDate = 'fieldTypeDate',
    fieldTypeMember = 'fieldTypeMember',
    fieldTypeProgress = 'fieldTypeProgress',
    fieldTypeRate = 'fieldTypeRate',
    fieldTypeLink = 'fieldTypeLink',
    fieldTypeAttachment = 'fieldTypeAttachment',
    fieldTypeCreatedBy = 'fieldTypeCreatedBy',
    fieldTypeCreatedAt = 'fieldTypeCreatedAt',
    fieldTypeUpdatedBy = 'fieldTypeUpdatedBy',
    fieldTypeUpdatedAt = 'fieldTypeUpdatedAt',
    fieldGroupBase = 'fieldGroupBase',
    fieldGroupAdvanced = 'fieldGroupAdvanced',
    rowAddFilterTooltip = 'rowAddFilterTooltip',
    earliestTime = 'earliestTime',
    earliestTimeResult = 'earliestTimeResult',
    latestTime = 'latestTime',
    latestTimeResult = 'latestTimeResult',
    dateRangeOfDays = 'dateRangeOfDays',
    dateRangeOfDaysResult = 'dateRangeOfDaysResult',
    dateRangeOfMonths = 'dateRangeOfMonths',
    dateRangeOfMonthsResult = 'dateRangeOfMonthsResult',
    selectedRecordsCount = 'selectedRecordsCount',
    selectedCellsCount = 'selectedCellsCount',
    stat = 'stat'
}

export const AITableGridI18nText = {
    [AITableGridI18nKey.dataPickerPlaceholder]: '选择日期',
    [AITableGridI18nKey.linkTooltip]: '链接',
    [AITableGridI18nKey.invalidLinkFormat]: '链接格式不正确',
    [AITableGridI18nKey.linkRequired]: '链接不能为空',
    [AITableGridI18nKey.linkText]: '文本',
    [AITableGridI18nKey.linkUrl]: '链接',
    [AITableGridI18nKey.inputText]: '输入文本',
    [AITableGridI18nKey.inputUrl]: '输入链接',
    [AITableGridI18nKey.fieldColumnName]: '表格列名',
    [AITableGridI18nKey.fieldColumnNamePlaceholder]: '输入列名称',
    [AITableGridI18nKey.fieldType]: '列类型',
    [AITableGridI18nKey.allowMultipleMembers]: '允许选择多个成员',
    [AITableGridI18nKey.cancel]: '取消',
    [AITableGridI18nKey.apply]: '应用',
    [AITableGridI18nKey.fieldNameRequired]: '列名不能为空',
    [AITableGridI18nKey.fieldNameDuplicate]: '列名已存在',
    [AITableGridI18nKey.confirm]: '确定',
    [AITableGridI18nKey.copiedCells]: '已复制 {count} 个单元格',
    [AITableGridI18nKey.invalidPasteContent]: '粘贴内容不符合当前类型',
    [AITableGridI18nKey.pasteOverMaxRecords]: '粘贴数据超过最大行数',
    [AITableGridI18nKey.pasteOverMaxFields]: '粘贴数据超过最大列数',
    [AITableGridI18nKey.fieldTypeText]: '单行文本',
    [AITableGridI18nKey.fieldTypeRichText]: '多行文本',
    [AITableGridI18nKey.fieldTypeSelect]: '单选',
    [AITableGridI18nKey.fieldTypeMultiSelect]: '多选',
    [AITableGridI18nKey.fieldTypeNumber]: '数字',
    [AITableGridI18nKey.fieldTypeDate]: '日期',
    [AITableGridI18nKey.fieldTypeMember]: '成员',
    [AITableGridI18nKey.fieldTypeProgress]: '进度',
    [AITableGridI18nKey.fieldTypeRate]: '评分',
    [AITableGridI18nKey.fieldTypeLink]: '链接',
    [AITableGridI18nKey.fieldTypeAttachment]: '附件',
    [AITableGridI18nKey.fieldTypeCreatedBy]: '创建人',
    [AITableGridI18nKey.fieldTypeCreatedAt]: '创建时间',
    [AITableGridI18nKey.fieldTypeUpdatedBy]: '更新人',
    [AITableGridI18nKey.fieldTypeUpdatedAt]: '更新时间',
    [AITableGridI18nKey.fieldGroupBase]: '基础',
    [AITableGridI18nKey.fieldGroupAdvanced]: '高级',
    [AITableGridI18nKey.rowAddFilterTooltip]: '本记录已被筛选过滤，点击该记录以外位置将被隐藏',
    [AITableGridI18nKey.earliestTime]: '最早时间',
    [AITableGridI18nKey.earliestTimeResult]: '最早时间 {{statValue}}',
    [AITableGridI18nKey.latestTime]: '最晚时间',
    [AITableGridI18nKey.latestTimeResult]: '最晚时间 {{statValue}}',
    [AITableGridI18nKey.dateRangeOfDays]: '时间范围(日)',
    [AITableGridI18nKey.dateRangeOfDaysResult]: '时间范围 {{statValue}} 天',
    [AITableGridI18nKey.dateRangeOfMonths]: '时间范围(月)',
    [AITableGridI18nKey.dateRangeOfMonthsResult]: '时间范围 {{statValue}} 月',
    [AITableGridI18nKey.selectedRecordsCount]: '已经选择 {count} 条记录',
    [AITableGridI18nKey.selectedCellsCount]: '已经选择 {count} 个单元格',
    [AITableGridI18nKey.stat]: '统计'
};

export const getDefaultI18nTextByKey = (key: AITableGridI18nKey): string => {
    return AITableGridI18nText[key] || key;
};

export const getI18nTextByKey = (aiTable: AITable, key: AITableGridI18nKey | string): string => {
    if (aiTable.getI18nTextByKey) {
        const customText = aiTable.getI18nTextByKey(key);
        if (customText) {
            return customText;
        }
    }
    const defaultText = getDefaultI18nTextByKey(key as AITableGridI18nKey);
    return defaultText;
};
