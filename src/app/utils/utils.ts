import { AITableFields, AITableFieldType, AITableRecords, AITableReferences, AITableSelectOptionStyle } from '@ai-table/grid';
import { AITableView, AITableViews } from '@ai-table/state';

export function sortByView(data: AITableRecords | AITableFields, activeViews: AITableView, type: 'record' | 'field') {
    const recordPositions = type === 'record' ? activeViews.recordPositions : activeViews.fieldPositions;
    return recordPositions.map((position) => {
        return data.find((record) => record._id === position)!;
    });
}

export function createDefaultPositions(views: AITableView[], activeId: string, data: AITableRecords | AITableFields, index: number) {
    const positions = {};
    // const position = getPosition(data, activeId, index);
    // const maxIndex = index === data.length - 1 ? data.length - 2 : data.length - 1;
    // const maxPosition = data[maxIndex].positions[activeId];
    // views.forEach((element) => {
    //     positions[element._id] = element._id === activeId ? position : maxPosition + 1;
    // });
    return positions;
}

export function getPosition(data: AITableRecords | AITableFields, activeViewId: string, index: number) {
    let position = data.length - 1;
    // if (index !== 0 && index !== data.length - 1) {
    //     const previousViewPosition = data[index - 1].positions[activeViewId];
    //     const nextViewPosition = data[index + 1].positions[activeViewId!];
    //     position = (previousViewPosition + nextViewPosition) / 2;
    // } else {
    //     position = index;
    // }
    return position;
}

export function getDefaultValue() {
    const initValue: {
        records: AITableRecords;
        fields: AITableFields;
    } = {
        records: [
            {
                _id: 'row-1',
                values: {
                    'column-1': '文本 1-1',
                    'column-2': ['1'],
                    'column-20': ['66b31d0c8097a908f74bcd8a'],
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8a'],
                    'column-3': 1,
                    'column-4': 1682235946,
                    'column-5': ['member_01'],
                    'column-6': 10,
                    'column-7': 3,
                    'column-8': {
                        url: 'https://www.baidu.com',
                        text: '百度链接'
                    },
                    'column-9': ['member_01'],
                    'column-10': 1682235946,
                    'column-11': ['member_02'],
                    'column-12': 1720490727
                }
            },
            {
                _id: 'row-2',
                values: {
                    'column-1': '文本 2-1',
                    'column-2': ['2'],
                    'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-21': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-22': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-3': 10,
                    'column-4': 1682235946,
                    'column-5': ['member_01', 'member_02'],
                    'column-6': 50,
                    'column-7': 1,
                    'column-8': {},
                    'column-9': ['member_01'],
                    'column-10': 1682235946,
                    'column-11': ['member_02'],
                    'column-12': 1720490727
                }
            },
            {
                _id: 'row-3',
                values: {
                    'column-1': '文本 3-1',
                    'column-2': ['3'],
                    'column-20': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-21': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-22': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-3': 100,
                    'column-4': 1682235946,
                    'column-5': [],
                    'column-6': 100,
                    'column-7': 1,
                    'column-8': {},
                    'column-9': [],
                    'column-10': 1682235946,
                    'column-11': ['member_02'],
                    'column-12': 1720490727
                }
            }
        ],
        fields: [
            {
                _id: 'column-1',
                name: '单行文本',
                type: AITableFieldType.text
            },
            {
                _id: 'column-2',
                name: '单选',
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    options: [
                        {
                            _id: '1',
                            text: '开始',
                            color: '#5dcfff'
                        },
                        {
                            _id: '2',
                            text: '进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: '3',
                            text: '已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-20',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.tag,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '222',
                            bg_color: '#E0B75D',
                            _id: '66b31d0c8097a908f74bcd8b'
                        },
                        {
                            text: '333',
                            bg_color: '#69B1E4',
                            _id: '66b31d0c8097a908f74bcd8c'
                        },
                        {
                            text: '444',
                            bg_color: '#77C386',
                            _id: '66b31d0c8097a908f74bcd8d'
                        },
                        {
                            text: '555',
                            bg_color: '#6EC4C4',
                            _id: '66b31d0c8097a908f74bcd8e'
                        },
                        {
                            text: '666',
                            bg_color: '#E581D4',
                            _id: '66b31d0c8097a908f74bcd8f'
                        },
                        {
                            text: '777',
                            bg_color: '#B0C774',
                            _id: '66b31d0c8097a908f74bcd90'
                        }
                    ]
                }
            },
            {
                _id: 'column-21',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.dot,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '222',
                            bg_color: '#E0B75D',
                            _id: '66b31d0c8097a908f74bcd8b'
                        },
                        {
                            text: '333',
                            bg_color: '#69B1E4',
                            _id: '66b31d0c8097a908f74bcd8c'
                        },
                        {
                            text: '444',
                            bg_color: '#77C386',
                            _id: '66b31d0c8097a908f74bcd8d'
                        },
                        {
                            text: '555',
                            bg_color: '#6EC4C4',
                            _id: '66b31d0c8097a908f74bcd8e'
                        },
                        {
                            text: '666',
                            bg_color: '#E581D4',
                            _id: '66b31d0c8097a908f74bcd8f'
                        },
                        {
                            text: '777',
                            bg_color: '#B0C774',
                            _id: '66b31d0c8097a908f74bcd90'
                        }
                    ]
                }
            },
            {
                _id: 'column-22',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.piece,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '222',
                            bg_color: '#E0B75D',
                            _id: '66b31d0c8097a908f74bcd8b'
                        },
                        {
                            text: '333',
                            bg_color: '#69B1E4',
                            _id: '66b31d0c8097a908f74bcd8c'
                        },
                        {
                            text: '444',
                            bg_color: '#77C386',
                            _id: '66b31d0c8097a908f74bcd8d'
                        },
                        {
                            text: '555',
                            bg_color: '#6EC4C4',
                            _id: '66b31d0c8097a908f74bcd8e'
                        },
                        {
                            text: '666',
                            bg_color: '#E581D4',
                            _id: '66b31d0c8097a908f74bcd8f'
                        },
                        {
                            text: '777',
                            bg_color: '#B0C774',
                            _id: '66b31d0c8097a908f74bcd90'
                        }
                    ]
                }
            },
            {
                _id: 'column-3',
                name: '数字',
                type: AITableFieldType.number
            },
            {
                _id: 'column-4',
                name: '日期',
                type: AITableFieldType.date
            },
            {
                _id: 'column-5',
                name: '成员(📌)',
                settings: {
                    is_multiple: true
                },
                type: AITableFieldType.member
            },
            {
                _id: 'column-6',
                name: '进度',
                type: AITableFieldType.progress
            },
            {
                _id: 'column-7',
                name: '评分(📌)',
                type: AITableFieldType.rate
            },
            {
                _id: 'column-8',
                name: '链接(📌)',
                type: AITableFieldType.link
            },

            {
                _id: 'column-9',
                name: '创建人',
                type: AITableFieldType.createdBy
            },
            {
                _id: 'column-10',
                name: '创建时间',
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-11',
                name: '更新人',
                type: AITableFieldType.updatedBy
            },
            {
                _id: 'column-12',
                name: '更新时间',
                type: AITableFieldType.updatedAt
            }
        ]
    };

    // console.time('build data');
    // initValue.fields = [];
    // for (let index = 0; index < 5; index++) {
    //     initValue.fields.push({
    //         _id: `column-${index}`,
    //         name: '文本',
    //         type: AITableFieldType.text
    //     });
    // }
    // initValue.records = [];
    // for (let index = 0; index < 40 * 3 * 2 * 30; index++) {
    //     const value: any = {};
    //     initValue.fields.forEach((column, columnIndex) => {
    //         value[`${column._id}`] = `name-${index}-${columnIndex}`;
    //     });
    //     initValue.records.push({
    //         _id: `row-${index + 1}`,
    //         values: value
    //     });
    // }
    // console.timeEnd('build data');
    return initValue;
}

export function getReferences(): AITableReferences {
    return {
        members: {
            member_01: {
                uid: 'member_01',
                display_name: 'admin',
                avatar: ''
            },
            member_02: {
                uid: 'member_02',
                display_name: 'member',
                avatar: ''
            }
        }
    };
}

export function getInitViews(): AITableViews {
    return [
        {
            _id: 'view0',
            name: '表格视图',
            recordPositions: ['row-1', 'row-2', 'row-3'],
            fieldPositions: [
                'column-1',
                'column-2',
                'column-20',
                'column-21',
                'column-22',
                'column-3',
                'column-4',
                'column-5',
                'column-6',
                'column-7',
                'column-8',
                'column-9',
                'column-10',
                'column-11',
                'column-12'
            ]
        },
        {
            _id: 'view1',
            name: '表格视图 1',
            recordPositions: ['row-3', 'row-1', 'row-2'],
            fieldPositions: [
                'column-5',
                'column-1',
                'column-6',
                'column-7',
                'column-8',
                'column-9',
                'column-10',
                'column-11',
                'column-12',
                'column-2',
                'column-20',
                'column-21',
                'column-22',
                'column-3',
                'column-4'
            ]
        }
    ];
}
