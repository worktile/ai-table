import {
    AITableRecord,
    AITableField,
    AITableReferences,
    AITableSelectOptionStyle,
    AITableView,
    AITableFieldType,
    SortDirection
} from '@ai-table/utils';

export const mockViews: AITableView[] = [
    {
        _id: 'viewId001',
        short_id: 'viewShortId001',
        name: '表格视图',
        settings: {
            // Look：group settings save here
            groups: [{ field_id: 'fieldId_select', direction: SortDirection.ascending }],
            collapsed_group_ids: ['fieldId_select_0_0'] //  The format of groupId is `${fieldId}_${depth}_${breakpointIndex}`;
        }
    },
    {
        _id: 'viewId002',
        short_id: 'viewShortId002',
        name: '表格视图 2',
        settings: {
            groups: [],
            collapsed_group_ids: []
        }
    }
];

export const mockFields: AITableField[] = [
    {
        _id: 'fieldId_text',
        name: '名称',
        type: AITableFieldType.text
    },
    {
        _id: 'fieldId_number',
        name: '单价',
        type: AITableFieldType.number
    },
    {
        _id: 'fieldId_select',
        name: '类别',
        type: AITableFieldType.select,
        settings: {
            option_style: AITableSelectOptionStyle.piece,
            options: [
                {
                    text: '蔬菜',
                    _id: 'singleOptionId001',
                    color: '#5dcfff'
                },
                {
                    text: '水果',
                    _id: 'singleOptionId002',
                    color: '#ffcd5d'
                }
            ]
        }
    }
];

export const mockRecords: AITableRecord[] = [
    {
        _id: 'recordId001',
        short_id: 'recordShortId001',
        created_at: 1760757010,
        created_by: 'memberUID002',
        updated_at: 1761650871,
        updated_by: 'memberUID002',
        values: {
            fieldId_text: '玉米',
            fieldId_number: 2,
            fieldId_select: ['singleOptionId001']
        }
    },
    {
        _id: 'recordId002',
        short_id: 'recordShortId002',
        created_at: 1760757010,
        created_by: 'memberUID004',
        updated_at: 1761650871,
        updated_by: 'memberUID004',
        values: {
            fieldId_text: '西红柿',
            fieldId_number: 3,
            fieldId_select: ['singleOptionId001']
        }
    },
    {
        _id: 'recordId003',
        short_id: 'recordShortId003',
        created_at: 1760757010,
        created_by: 'memberUID005',
        updated_at: 1761650871,
        updated_by: 'memberUID005',
        values: {
            fieldId_text: '香菜',
            fieldId_number: 1,
            fieldId_select: ['singleOptionId001']
        }
    },
    {
        _id: 'recordId004',
        short_id: 'recordShortId004',
        created_at: 1760757010,
        created_by: 'memberUID006',
        updated_at: 1761650871,
        updated_by: 'memberUID006',
        values: {
            fieldId_text: '苹果',
            fieldId_number: 5,
            fieldId_select: ['singleOptionId002']
        }
    },
    {
        _id: 'recordId005',
        short_id: 'recordShortId005',
        created_at: 1760757010,
        created_by: 'memberUID007',
        updated_at: 1761650871,
        updated_by: 'memberUID007',
        values: {
            fieldId_text: '香蕉',
            fieldId_number: 2,
            fieldId_select: ['singleOptionId002']
        }
    },
    {
        _id: 'recordId006',
        short_id: 'recordShortId006',
        created_at: 1760757010,
        created_by: 'memberUID008',
        updated_at: 1761650871,
        updated_by: 'memberUID008',
        values: {
            fieldId_text: '葡萄',
            fieldId_number: 6,
            fieldId_select: ['singleOptionId002']
        }
    }
];

export const mockReferences: AITableReferences = {
    members: {},
    attachments: {}
};
