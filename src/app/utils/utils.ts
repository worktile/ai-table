import { AITableFieldType } from '@ai-table/grid';
import { DemoAIField, DemoAIRecord } from '../types';
const LOCAL_STORAGE_KEY = 'ai-table-data';

export function sortDataByView(data: DemoAIRecord[] | DemoAIField[], activeViewId: string) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeViewId] - b.positions[activeViewId]);
    }
    return data;
}

export function getSortFieldsAndRecordsByPositions(records: DemoAIRecord[], fields: DemoAIField[], activeViewId: string) {
    const newRecords = sortDataByView(records, activeViewId) as DemoAIRecord[];
    const newFields = sortDataByView(fields, activeViewId) as DemoAIField[];
    return {
        records: newRecords,
        fields: newFields
    };
}

export function setActiveViewPositions(value: DemoAIRecord[] | DemoAIField[], activeViewId: string) {
    return value.map((item, index) => {
        return {
            ...item,
            positions: {
                ...(item.positions || {}),
                [activeViewId]: index
            }
        };
    });
}

export function getLocalStorage() {
    const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
    return data ? JSON.parse(data) : getDefaultValue();
}

export function setLocalData(data: string) {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}`, data);
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
                    'column-3': {
                        url: 'https://www.baidu.com',
                        text: '百度链接'
                    },
                    'column-4': 3,
                    'column-5': 10,
                    'column-6': 1682235946,
                    'column-7': 1720490727,
                    'column-8': 1,
                    'column-9': 1682235946
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
                    'column-3': {},
                    'column-4': 1,
                    'column-5': 50,
                    'column-6': 1682235946,
                    'column-7': 1720490727,
                    'column-8': 10,
                    'column-9': 1682235946
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
                    'column-3': {},
                    'column-4': 1,
                    'column-5': 100,
                    'column-6': 1682235946,
                    'column-7': 1720490727,
                    'column-8': 100,
                    'column-9': 1682235946
                }
            }
        ],
        fields: [
            {
                _id: 'column-1',
                name: '文本',
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
                name: '链接',
                positions: {
                    view1: 2,
                    view2: 2
                },
                type: AITableFieldType.link
            },
            {
                _id: 'column-4',
                name: '评分',
                positions: {
                    view1: 3,
                    view2: 4
                },
                type: AITableFieldType.rate
            },
            {
                _id: 'column-5',
                name: '进度',
                positions:{
                    view1: 4,
                    view2: 0
                },
                type: AITableFieldType.progress
            },
            {
                _id: 'column-6',
                name: '创建时间',
                positions:{
                    view1: 5,
                    view2: 5
                },
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-7',
                name: '更新时间',
                positions:{
                    view1: 6,
                    view2: 6
                },
                type: AITableFieldType.updatedAt
            },
            {
                _id: 'column-8',
                name: '数字',
                positions:{
                    view1: 7,
                    view2: 7
                },
                type: AITableFieldType.number
            },
            {
                _id: 'column-9',
                name: '日期',
                positions:{
                    view1: 8,
                    view2: 8
                },
                type: AITableFieldType.date
            }
        ]
    };

    // console.time('build data');
    // initValue.fields = [];
    // for (let index = 0; index < 5; index++) {
    //     initValue.fields.push({
    //         _id: `column-${index}`,
    //         name: "文本",
    //         type: AITableFieldType.text,
    //     });
    // }
    // initValue.records = [];
    // for (let index = 0; index < 40 * 3 * 2*30; index++) {
    //     const value: any = {};
    //     initValue.fields.forEach((column, columnIndex) => {
    //         value[`${column._id}`] = `name-${index}-${columnIndex}`;
    //     });
    //     initValue.records.push({
    //         _id: `row-${index + 1}`,
    //         value: value,
    //     });
    // }
    // console.timeEnd('build data');
    return initValue;
}
