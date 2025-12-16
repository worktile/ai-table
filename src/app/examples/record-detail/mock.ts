import { AITableField, AITableFieldType, AITableRecord, AITableReferences } from '@ai-table/utils';

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
            fieldId_text: '小明',
            fieldId_number: 19
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
            fieldId_number: 18
        }
    }
];
export const mockReferences: AITableReferences = {
    members: {},
    attachments: {}
};
