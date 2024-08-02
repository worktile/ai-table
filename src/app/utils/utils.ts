import { AITableFieldType } from '@ai-table/grid';
import { DemoAIField, DemoAIRecord } from '../types';
const LOCAL_STORAGE_KEY = 'ai-table-data';

export function sortDataByPositions(data: DemoAIRecord[] | DemoAIField[], activeViewId: string) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeViewId] - b.positions[activeViewId]);
    }
    return data;
}

export function getSortFieldsAndRecordsByPositions(records: DemoAIRecord[], fields: DemoAIField[], activeViewId: string) {
    const newRecords = sortDataByPositions(records, activeViewId) as DemoAIRecord[];
    const newFields = sortDataByPositions(fields, activeViewId) as DemoAIField[];
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
                id: 'row-1',
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
                    'column-4': 3
                }
            },
            {
                id: 'row-2',
                positions: {
                    view1: 1,
                    view2: 2
                },
                values: {
                    'column-1': '文本 2-1',
                    'column-2': '2',
                    'column-3': {},
                    'column-4': 1
                }
            },
            {
                id: 'row-3',
                positions: {
                    view1: 2,
                    view2: 0
                },
                values: {
                    'column-1': '文本 3-1',
                    'column-2': '3',
                    'column-3': {},
                    'column-4': 1
                }
            }
        ],
        fields: [
            {
                id: 'column-1',
                name: '文本',
                positions: {
                    view1: 0,
                    view2: 1
                },
                type: AITableFieldType.text
            },
            {
                id: 'column-2',
                name: '单选',
                positions: {
                    view1: 1,
                    view2: 3
                },
                type: AITableFieldType.select,
                options: [
                    {
                        id: '1',
                        name: '开始',
                        color: '#5dcfff'
                    },
                    {
                        id: '2',
                        name: '进行中',
                        color: '#ffcd5d'
                    },
                    {
                        id: '3',
                        name: '已完成',
                        color: '#73d897'
                    }
                ]
            },
            {
                id: 'column-3',
                name: '链接',
                positions: {
                    view1: 2,
                    view2: 2
                },
                type: AITableFieldType.link
            },
            {
                id: 'column-4',
                name: '评分',
                positions: {
                    view1: 3,
                    view2: 4
                },
                type: AITableFieldType.rate
            }
        ]
    };

    // console.time('build data');
    // initValue.fields = [];
    // for (let index = 0; index < 5; index++) {
    //     initValue.fields.push({
    //         id: `column-${index}`,
    //         name: "文本",
    //         type: AITableFieldType.text,
    //     });
    // }
    // initValue.records = [];
    // for (let index = 0; index < 40 * 3 * 2*30; index++) {
    //     const value: any = {};
    //     initValue.fields.forEach((column, columnIndex) => {
    //         value[`${column.id}`] = `text-${index}-${columnIndex}`;
    //     });
    //     initValue.records.push({
    //         id: `row-${index + 1}`,
    //         value: value,
    //     });
    // }
    // console.timeEnd('build data');
    return initValue;
}
