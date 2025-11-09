import {
    AITableViewField,
    AITableFieldType,
    AITableFilterLogical,
    AITableFilterOperation,
    AITableViewRecord,
    AITableReferences,
    AITableSelectOptionStyle,
    AITableView
} from '@ai-table/utils';

export const mockViews: AITableView[] = [
    {
        _id: 'viewId001',
        short_id: 'viewShortId001',
        name: '表格视图',
        settings: {
            // Look: filter settings save here
            condition_logical: AITableFilterLogical.or,
            conditions: [
                {
                    field_id: 'fieldId_text',
                    operation: AITableFilterOperation.contain,
                    value: '小明'
                },
                {
                    field_id: 'fieldId_number',
                    operation: AITableFilterOperation.gte,
                    value: 19
                }
            ]
        }
    },
    {
        _id: 'viewId002',
        short_id: 'viewShortId002',
        name: '表格视图 2',
        settings: {}
    }
];

export const mockFields: AITableViewField[] = [
    {
        _id: 'fieldId_text',
        name: '姓名',
        type: AITableFieldType.text,
        positions: {}
    },
    {
        _id: 'fieldId_number',
        name: '年龄',
        type: AITableFieldType.number,
        positions: {}
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
        },
        positions: {}
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
        positions: {}
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
        positions: {}
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
        positions: {}
    }
];

export const mockReferences: AITableReferences = {
    members: {},
    attachments: {}
};
