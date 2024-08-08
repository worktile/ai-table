import { AITableFieldType, AITableReferences } from '@ai-table/grid';
import { DemoAIField, DemoAIRecord, Positions } from '../types';
import { AITableView } from '../types/view';

export function sortDataByView(data: DemoAIRecord[] | DemoAIField[], activeViewId: string) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeViewId] - b.positions[activeViewId]);
    }
    return data;
}

export function createDefaultPositions(views: AITableView[], index: number) {
    const positions: Positions = {};
    views.forEach((element) => {
        positions[element._id] = index;
    });
    return positions;
}

export function getDefaultValue() {
    const initValue: {
        records: DemoAIRecord[];
        fields: DemoAIField[];
    } = {
        records: [
            {
                _id: 'row-1',
                positions: {
                    view1: 0,
                    view2: 1
                },
                values: {
                    'column-1': '文本 1-1',
                    'column-2': '1',
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
                positions: {
                    view1: 1,
                    view2: 2
                },
                values: {
                    'column-1': '文本 2-1',
                    'column-2': '2',
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
                positions: {
                    view1: 2,
                    view2: 0
                },
                values: {
                    'column-1': '文本 3-1',
                    'column-2': '3',
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
                positions: {
                    view1: 0,
                    view2: 1
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-2',
                name: '单选',
                positions: {
                    view1: 1,
                    view2: 3
                },
                type: AITableFieldType.select,
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
            },
            {
                _id: 'column-3',
                name: '数字',
                positions: {
                    view1: 2,
                    view2: 7
                },
                type: AITableFieldType.number
            },
            {
                _id: 'column-4',
                name: '日期',
                positions: {
                    view1: 3,
                    view2: 8
                },
                type: AITableFieldType.date
            },
            {
                _id: 'column-5',
                name: '成员(📌)',
                positions: {
                    view1: 4,
                    view2: 9
                },
                isMultiple: true,
                type: AITableFieldType.member
            },
            {
                _id: 'column-6',
                name: '进度',
                positions: {
                    view1: 5,
                    view2: 0
                },
                type: AITableFieldType.progress
            },
            {
                _id: 'column-7',
                name: '评分(📌)',
                positions: {
                    view1: 6,
                    view2: 4
                },
                type: AITableFieldType.rate
            },
            {
                _id: 'column-8',
                name: '链接(📌)',
                positions: {
                    view1: 7,
                    view2: 2
                },
                type: AITableFieldType.link
            },

            {
                _id: 'column-9',
                name: '创建人',
                positions: {
                    view1: 8,
                    view2: 10
                },
                type: AITableFieldType.createdBy
            },
            {
                _id: 'column-10',
                name: '创建时间',
                positions: {
                    view1: 9,
                    view2: 5
                },
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-11',
                name: '更新人',
                positions: {
                    view1: 10,
                    view2: 11
                },
                type: AITableFieldType.updatedBy
            },
            {
                _id: 'column-12',
                name: '更新时间',
                positions: {
                    view1: 11,
                    view2: 6
                },
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
    //         positions: { view1: index, view2: index },
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
    //         positions: { view1: index, view2: index },
    //         values: value
    //     });
    // }
    // console.timeEnd('build data');
    return initValue;
}

export function getReferences(): AITableReferences {
    return {
        members: [
            {
                uid: 'member_01',
                display_name: 'admin',
                avatar: ''
            },
            {
                uid: 'member_02',
                display_name: 'member',
                avatar: ''
            }
        ]
    };
}
