import { AITableField, AITableFieldType, AITableRecord, AITableReferences, AITableSelectOptionStyle } from '@ai-table/utils';

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
            option_style: AITableSelectOptionStyle.dot, // text(默认)、dot、tag、piece
            options: [
                {
                    text: '男',
                    _id: 'singleOptionId001',
                    color: '#5dcfff' // option_style 为 dot 或 tag 或 piece 时有效
                },
                {
                    text: '女',
                    _id: 'singleOptionId002',
                    color: '#ffcd5d'
                }
            ]
        }
    },
    {
        _id: 'fieldId_checkbox',
        name: '喜欢南方人',
        type: AITableFieldType.checkbox
    },
    {
        _id: 'fieldId_select_multiple',
        name: '爱好',
        type: AITableFieldType.select,
        settings: {
            is_multiple: true,
            option_style: AITableSelectOptionStyle.tag,
            options: [
                {
                    text: '篮球',
                    _id: 'multipleOptionId001',
                    bg_color: '#5dcfff'
                },
                {
                    text: '跑步',
                    _id: 'multipleOptionId002',
                    bg_color: '#ffcd5d'
                },
                {
                    text: '游泳',
                    _id: 'multipleOptionId003',
                    bg_color: '#77C386'
                }
            ]
        }
    },
    {
        _id: 'fieldId_members',
        name: '朋友',
        type: AITableFieldType.member,
        settings: {
            is_multiple: true // false(默认)、true
        }
    },
    // {
    //     _id: 'fieldId_date',
    //     name: '日期',
    //     type: AITableFieldType.date
    // }
    {
        _id: 'fieldId_progress',
        name: '进度',
        type: AITableFieldType.progress
    },
    {
        _id: 'fieldId_rate',
        name: '评分',
        type: AITableFieldType.rate
    },
    {
        _id: 'fieldId_link',
        name: '链接',
        type: AITableFieldType.link
    },
    {
        _id: 'fieldId_attachment',
        name: '附件',
        type: AITableFieldType.attachment
    },
    // {
    //     _id: 'fieldId_richText',
    //     name: '多行文本',
    //     type: AITableFieldType.richText
    // },
    {
        _id: 'fieldId_createdBy',
        name: '创建人',
        type: AITableFieldType.createdBy
    },
    // {
    //     _id: 'fieldId_createdAt',
    //     name: '创建时间',
    //     type: AITableFieldType.createdAt
    // },
    {
        _id: 'fieldId_updatedBy',
        name: '更新人',
        type: AITableFieldType.updatedBy
    }
    // {
    //     _id: 'fieldId_updatedAt',
    //     name: '更新时间',
    //     type: AITableFieldType.updatedAt
    // }
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
            fieldId_number: 19,
            fieldId_select: ['singleOptionId001'],
            fieldId_checkbox: true,
            fieldId_select_multiple: ['multipleOptionId001'],
            fieldId_members: ['memberUID005'],
            fieldId_progress: 50,
            fieldId_rate: 3,
            fieldId_link: { url: 'https://pingcode.com', text: 'PingCode' },
            fieldId_attachment: ['attachmentId001']
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
            fieldId_select: ['singleOptionId002'],
            fieldId_checkbox: false,
            fieldId_select_multiple: ['multipleOptionId002', 'multipleOptionId003'],
            fieldId_members: ['memberUID005', 'memberUID004'],
            fieldId_progress: 71,
            fieldId_rate: 5,
            fieldId_link: { url: 'https://worktile.com', text: 'Worktile' },
            fieldId_attachment: ['attachmentId001', 'attachmentId002', 'attachmentId003']
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
            fieldId_select: ['singleOptionId001'],
            fieldId_checkbox: false,
            fieldId_select_multiple: ['multipleOptionId002'],
            fieldId_members: ['memberUID002', 'memberUID003'],
            fieldId_progress: 21,
            fieldId_rate: 2,
            fieldId_link: { url: 'https://www.baidu.com', text: '百度' },
            fieldId_attachment: ['attachmentId004', 'attachmentId005']
        }
    }
];
export const mockReferences: AITableReferences = {
    members: {
        memberUID001: {
            uid: 'memberUID001',
            display_name: '小明',
            display_name_pinyin: 'xiaoming',
            avatar: 'https://app-pc-alpha-1251945081.cos.ap-nanjing.myqcloud.com/7d9eaab4-eba1-4c87-8cd3-71222a031141_80x80.png'
        },
        memberUID002: {
            uid: 'memberUID002',
            display_name: '小红',
            display_name_pinyin: 'xiaohong',
            avatar: ''
        },
        memberUID003: {
            uid: 'memberUID003',
            display_name: '小冬',
            display_name_pinyin: 'xiaodong',
            avatar: ''
        },
        memberUID004: {
            uid: 'memberUID004',
            display_name: '小李',
            display_name_pinyin: 'xiaoli',
            avatar: ''
        },
        memberUID005: {
            uid: 'memberUID005',
            display_name: '小刚',
            display_name_pinyin: 'xiaogang',
            avatar: ''
        }
    },
    attachments: {
        attachmentId001: {
            _id: 'attachmentId001',
            title: '文档.docx',
            addition: {
                ext: 'docx',
                path: 'baa7652b-e2ad-447f-b086-d4a929ae079a',
                size: 9962
            }
        },
        attachmentId002: {
            _id: '67da7c119675bccb963cc524',
            title: '表格.xlsx',
            addition: {
                ext: 'xlsx',
                path: '43ca5702-7608-4649-bb12-f0620e0f4895',
                size: 17634
            }
        },
        attachmentId003: {
            _id: '67da7c319675bccb963cc52b',
            title: '模型.3mf',
            addition: {
                ext: '3mf',
                path: 'a64eddaf-a70e-46b6-b2fa-3baaac19f6a8',
                size: 1356157
            }
        },
        attachmentId004: {
            _id: '67da7c419675bccb963cc52d',
            title: '压缩包.zip',
            addition: {
                ext: 'zip',
                path: 'fb4bf273-0d98-49ce-9dfa-53f197bdbd40',
                size: 1815883
            }
        },
        attachmentId005: {
            _id: '67da7c599675bccb963cc52f',
            title: 'PDF.pdf',
            addition: {
                ext: 'pdf',
                path: '5ff9237d-45da-49fd-9f14-40102a0d7c2a',
                size: 798825
            }
        },
        attachmentId006: {
            _id: '67da80d89675bccb963cc588',
            title: '图片.png',
            addition: {
                ext: 'png',
                path: '41b43419-3f06-44b0-852d-8d1d9200742b',
                size: 23511
            }
        },
        attachmentId007: {
            _id: '67da80f09675bccb963cc58a',
            title: '音频.m3u',
            addition: {
                ext: 'm3u',
                path: '23fc1590-0d8f-4e03-8bb2-3feb02f9ebaa',
                size: 2626981
            }
        },
        attachmentId008: {
            _id: '67da81429675bccb963cc596',
            title: '图片2.jpg',
            addition: {
                ext: 'jpg',
                path: '8a5f7b97-d515-4d73-9c20-141c88e41828',
                size: 2474023
            }
        }
    }
};
