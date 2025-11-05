import {
    AITableFieldType,
    AITableViewRecord,
    AITableField,
    AITableReferences,
    AITableSelectOptionStyle,
    AITableView,
    SortDirection
} from '@ai-table/utils';

export const mockViews: AITableView[] = [
    {
        _id: 'viewId001',
        short_id: 'viewShortId001',
        name: '表格视图',
        settings: {
            // Look：sort settings save here
            is_keep_sort: false,
            sorts: [{ sort_by: 'fieldId_select', direction: SortDirection.ascending }]
        }
    },
    {
        _id: 'viewId002',
        short_id: 'viewShortId002',
        name: '表格视图 2',
        settings: {
            is_keep_sort: false,
            sorts: []
        }
    }
];

export const mockFields: AITableField[] = [
    {
        _id: 'fieldId_text',
        name: '姓名',
        type: AITableFieldType.text
    },
    {
        _id: 'fieldId_number',
        name: '年龄',
        type: AITableFieldType.number
    },
    {
        _id: 'fieldId_select',
        name: '性别',
        type: AITableFieldType.select,
        settings: {
            option_style: AITableSelectOptionStyle.dot,
            options: [
                {
                    text: '男',
                    _id: 'singleOptionId001',
                    color: '#5dcfff'
                },
                {
                    text: '女',
                    _id: 'singleOptionId002',
                    color: '#ffcd5d'
                }
            ]
        }
    }
];

export const mockRecords: AITableViewRecord[] = [
    {
        _id: 'recordId001',
        short_id: 'recordShortId001',
        created_at: 1760757010,
        created_by: 'memberUID002',
        updated_at: 1761650871,
        updated_by: 'memberUID002',
        values: {
            fieldId_text: '小明',
            fieldId_number: 19,
            fieldId_select: ['singleOptionId001']
        },
        // See here：sort positions in different views
        positions: {
            viewId001: 1,
            viewId002: 1
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
            fieldId_text: '小红',
            fieldId_number: 18,
            fieldId_select: ['singleOptionId002']
        },
        positions: {
            viewId001: 2,
            viewId002: 3
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
            fieldId_text: '小刚',
            fieldId_number: 32,
            fieldId_select: ['singleOptionId001']
        },
        positions: {
            viewId001: 3,
            viewId002: 2
        }
    }
];

export const mockReferences: AITableReferences = {
    members: {},
    attachments: {}
};
