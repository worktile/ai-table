import { AITableFieldType, AITableSelectOptionStyle, AITableStatType, AITableViewFields, AITableViewRecords } from '@ai-table/utils';
import { getUnixTime } from 'date-fns';
import { AITableCustomReferences } from '../types/grid';
import { AITableCustomFieldType } from '../types/field';

export function sortDataByView(data: AITableViewRecords | AITableViewFields, activeViewId: string) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeViewId] - b.positions[activeViewId]);
    }
    return data;
}

export const getDefaultTrackableEntity = (options?: {
    [AITableFieldType.createdBy]?: string;
    [AITableFieldType.createdAt]?: string;
    [AITableFieldType.updatedBy]?: string;
    [AITableFieldType.updatedAt]?: string;
}) => {
    return {
        created_by: options?.[AITableFieldType.createdBy] || 'member_01',
        created_at: getUnixTime(new Date(options?.[AITableFieldType.createdAt] || '2024-12-15')),
        updated_by: options?.[AITableFieldType.updatedBy] || 'member_01',
        updated_at: getUnixTime(new Date(options?.[AITableFieldType.updatedAt] || '2024-12-17'))
    };
};

export function getDefaultAITableValue() {
    return getBasicData();
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [
            {
                _id: 'row-1',
                short_id: `row-short-id-${1}`,
                ...getDefaultTrackableEntity({ updated_at: '2024-12-19' }),
                positions: {
                    view1: 0,
                    view2: 1
                },
                values: {
                    'column-1':
                        '文本 1-1 column-1 - 超级长的文本，用来测试文本省略或折行，当超出允许打最大高度时，将形成内部滚动条。KonvaJS 是一个功能强大且富有创意的 JavaScript 库，为前端开发者带来了全新的图形绘制和交互体验。KonvaJS 开启了一扇通往绚丽视觉世界的大门。它提供了丰富的工具和功能，使开发者能够轻松地在网页上创建复杂而精美的图形。无论是简单的几何形状，如矩形、圆形和三角形，还是复杂的自定义图形，KonvaJS 都能胜任。它支持多种图形操作，包括缩放、旋转和移动，让你可以轻松地变换图形的外观和位置。通过直观的 API，开发者可以快速上手，轻松地控制图形的属性和行为。',
                    'column-13':
                        '文本 1-1 column-13 - 超级长的文本，用来测试文本省略或折行，当超出允许打最大高度时，将形成内部滚动条。KonvaJS 是一个功能强大且富有创意的 JavaScript 库，为前端开发者带来了全新的图形绘制和交互体验。KonvaJS 开启了一扇通往绚丽视觉世界的大门。它提供了丰富的工具和功能，使开发者能够轻松地在网页上创建复杂而精美的图形。无论是简单的几何形状，如矩形、圆形和三角形，还是复杂的自定义图形，KonvaJS 都能胜任。它支持多种图形操作，包括缩放、旋转和移动，让你可以轻松地变换图形的外观和位置。通过直观的 API，开发者可以快速上手，轻松地控制图形的属性和行为。',
                    'column-2': ['_id_1'],
                    'column-110': ['dot_1'],
                    'column-111': ['piece_1'],
                    'column-112': ['tag_1'],
                    'column-20': ['66b31d0c8097a908f74bcd8a'],
                    'column-3': 0,
                    'column-4': { timestamp: 1734636127 },
                    'column-5': ['member_02'],
                    'column-566': ['member_02'],
                    'column-6': 10,
                    'column-7': 5,
                    'column-8': {
                        url: 'https://www.baidu.com',
                        text: '百度链接'
                    },
                    // 'column-9': ['member_01'],
                    // 'column-10': { timestamp: 1682235946 },
                    // 'column-11': ['member_02'],
                    // 'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-24': [
                        '67da7c119675bccb963cc524',
                        '67da7c319675bccb963cc52b',
                        '67da7c419675bccb963cc52d',
                        '67da7c599675bccb963cc52f'
                    ],
                    'column-25': [],
                    'column-custom_demo':
                        '这是一个可滚动的容器示例\n内容区域比容器大，所以会显示滚动条 00000\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条',
                    'column-checkbox': true
                }
            },
            {
                _id: 'row-2',
                short_id: `row-short-id-${2}`,
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 1,
                    view2: 2
                },
                values: {
                    'column-1': '文本 2-1 column-1',
                    'column-13': '文本 2-1 column-13',
                    'column-2': ['_id_2'],
                    'column-110': ['dot_2'],
                    'column-111': ['piece_2'],
                    'column-112': ['tag_2'],
                    'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-3': 10,
                    'column-4': { timestamp: 1682235946 },
                    'column-5': ['member_01', 'member_02', 'member_03', 'member_04', 'member_05', 'member_06', 'member_07', 'member_08'],
                    'column-566': ['member_01'],
                    'column-6': 50,
                    'column-7': 4,
                    'column-8': {},
                    // 'column-9': ['member_01'],
                    // 'column-10': { timestamp: 1682235946 },
                    // 'column-11': ['member_02'],
                    // 'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    // 'column-24': ['676e3e9b5660cd68d7f49e60']
                    'column-24': [
                        '676e3e9b5660cd68d7f49e60',
                        '67da7c119675bccb963cc524',
                        '67da7c319675bccb963cc52b',
                        '67da7c419675bccb963cc52d',
                        '67da7c599675bccb963cc52f',
                        '67da80d89675bccb963cc588',
                        '67da80f09675bccb963cc58a',
                        '67da81429675bccb963cc596'
                    ],
                    'column-25': [
                        {
                            type: 'paragraph',
                            key: 'YSzXW',
                            children: [
                                {
                                    text: '多行文本实例'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'jtnfi',
                            children: [
                                {
                                    text: '第一行数据。'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'NPdNb',
                            children: [
                                {
                                    text: '第二行数据。'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'bGdar',
                            children: [
                                {
                                    text: '第三行数据。'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'bPSBF',
                            children: [
                                {
                                    text: ''
                                }
                            ]
                        }
                    ],
                    'column-custom_demo': null
                }
            },
            {
                _id: 'row-3',
                short_id: `row-short-id-${3}`,
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 2,
                    view2: 0
                },
                values: {
                    'column-1': '文本 3-1 column-2',
                    'column-13': '文本 3-1 column-13',
                    'column-2': ['_id_3'],
                    'column-110': ['dot_3'],
                    'column-111': ['piece_3'],
                    'column-112': ['tag_3'],
                    'column-20': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-3': 120000000,
                    'column-4': { timestamp: 1682235946 },
                    'column-5': [],
                    'column-566': ['member_01'],
                    'column-6': 100,
                    'column-7': null,
                    'column-8': {},
                    // 'column-9': [],
                    // 'column-10': { timestamp: 1727254598 },
                    // 'column-11': ['member_02'],
                    // 'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-24': ['676e3e9b5660cd68d7f49e60'],
                    'column-25': []
                }
            },
            {
                _id: 'row-4',
                short_id: `row-short-id-${4}`,
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 3,
                    view2: 3
                },
                values: {
                    'column-1': '文本 2-1 column-1',
                    'column-13': '文本 2-1 column-13',
                    'column-2': ['_id_2'],
                    'column-110': ['dot_2'],
                    'column-111': ['piece_2'],
                    'column-112': ['tag_2'],
                    'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-3': 10,
                    'column-4': { timestamp: 1682235946 },
                    'column-5': ['member_01', 'member_02', 'member_03', 'member_04', 'member_05', 'member_06', 'member_07', 'member_08'],
                    'column-566': ['member_01'],
                    'column-6': 50,
                    'column-7': 4,
                    'column-8': {},
                    // 'column-9': ['member_01'],
                    // 'column-10': { timestamp: 1682235946 },
                    // 'column-11': ['member_02'],
                    // 'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    // 'column-24': ['676e3e9b5660cd68d7f49e60']
                    'column-24': [
                        '676e3e9b5660cd68d7f49e60',
                        '67da7c119675bccb963cc524',
                        '67da7c319675bccb963cc52b',
                        '67da7c419675bccb963cc52d',
                        '67da7c599675bccb963cc52f',
                        '67da80d89675bccb963cc588',
                        '67da80f09675bccb963cc58a',
                        '67da81429675bccb963cc596'
                    ],
                    'column-25': [
                        {
                            type: 'paragraph',
                            key: 'YSzXW',
                            children: [
                                {
                                    text: '多行文本实例'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'jtnfi',
                            children: [
                                {
                                    text: '第一行数据。'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'NPdNb',
                            children: [
                                {
                                    text: '第二行数据。'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'bGdar',
                            children: [
                                {
                                    text: '第三行数据。'
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            key: 'bPSBF',
                            children: [
                                {
                                    text: ''
                                }
                            ]
                        }
                    ],
                    'column-custom_demo': null
                }
            },
            {
                _id: 'row-5',
                short_id: `row-short-id-${5}`,
                ...getDefaultTrackableEntity({ updated_at: '2024-12-19' }),
                positions: {
                    view1: 4,
                    view2: 1
                },
                values: {
                    'column-1':
                        '文本 1-1 column-1 - 超级长的文本，用来测试文本省略或折行，当超出允许打最大高度时，将形成内部滚动条。KonvaJS 是一个功能强大且富有创意的 JavaScript 库，为前端开发者带来了全新的图形绘制和交互体验。KonvaJS 开启了一扇通往绚丽视觉世界的大门。它提供了丰富的工具和功能，使开发者能够轻松地在网页上创建复杂而精美的图形。无论是简单的几何形状，如矩形、圆形和三角形，还是复杂的自定义图形，KonvaJS 都能胜任。它支持多种图形操作，包括缩放、旋转和移动，让你可以轻松地变换图形的外观和位置。通过直观的 API，开发者可以快速上手，轻松地控制图形的属性和行为。',
                    'column-13':
                        '文本 1-1 column-13 - 超级长的文本，用来测试文本省略或折行，当超出允许打最大高度时，将形成内部滚动条。KonvaJS 是一个功能强大且富有创意的 JavaScript 库，为前端开发者带来了全新的图形绘制和交互体验。KonvaJS 开启了一扇通往绚丽视觉世界的大门。它提供了丰富的工具和功能，使开发者能够轻松地在网页上创建复杂而精美的图形。无论是简单的几何形状，如矩形、圆形和三角形，还是复杂的自定义图形，KonvaJS 都能胜任。它支持多种图形操作，包括缩放、旋转和移动，让你可以轻松地变换图形的外观和位置。通过直观的 API，开发者可以快速上手，轻松地控制图形的属性和行为。',
                    'column-2': ['_id_1'],
                    'column-110': ['dot_1'],
                    'column-111': ['piece_1'],
                    'column-112': ['tag_1'],
                    'column-20': ['66b31d0c8097a908f74bcd8a'],
                    'column-3': 0,
                    'column-4': { timestamp: 1757070500 },
                    'column-5': ['member_02'],
                    'column-566': ['member_02'],
                    'column-6': 10,
                    'column-7': 5,
                    'column-8': {
                        url: 'https://www.baidu.com',
                        text: '百度链接'
                    },
                    // 'column-9': ['member_01'],
                    // 'column-10': { timestamp: 1682235946 },
                    // 'column-11': ['member_02'],
                    // 'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-24': [
                        '67da7c119675bccb963cc524',
                        '67da7c319675bccb963cc52b',
                        '67da7c419675bccb963cc52d',
                        '67da7c599675bccb963cc52f'
                    ],
                    'column-25': [],
                    'column-custom_demo':
                        '这是一个可滚动的容器示例\n内容区域比容器大，所以会显示滚动条 00000\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条',
                    'column-checkbox': true
                }
            },
            {
                _id: 'row-6',
                short_id: `row-short-id-${6}`,
                ...getDefaultTrackableEntity({ updated_at: '2024-12-19' }),
                positions: {
                    view1: 4,
                    view2: 1
                },
                values: {
                    'column-1':
                        '文本 1-1 column-1 - 超级长的文本，用来测试文本省略或折行，当超出允许打最大高度时，将形成内部滚动条。KonvaJS 是一个功能强大且富有创意的 JavaScript 库，为前端开发者带来了全新的图形绘制和交互体验。KonvaJS 开启了一扇通往绚丽视觉世界的大门。它提供了丰富的工具和功能，使开发者能够轻松地在网页上创建复杂而精美的图形。无论是简单的几何形状，如矩形、圆形和三角形，还是复杂的自定义图形，KonvaJS 都能胜任。它支持多种图形操作，包括缩放、旋转和移动，让你可以轻松地变换图形的外观和位置。通过直观的 API，开发者可以快速上手，轻松地控制图形的属性和行为。',
                    'column-13': '日期：同天不同时间',
                    'column-2': ['_id_1'],
                    'column-110': ['dot_1'],
                    'column-111': ['piece_1'],
                    'column-112': ['tag_1'],
                    'column-20': ['66b31d0c8097a908f74bcd8a'],
                    'column-3': 0,
                    'column-4': { timestamp: 1757071800 },
                    'column-5': ['member_02'],
                    'column-566': ['member_02'],
                    'column-6': 10,
                    'column-7': 5,
                    'column-8': {
                        url: 'https://www.baidu.com',
                        text: '百度链接'
                    },
                    // 'column-9': ['member_01'],
                    // 'column-10': { timestamp: 1682235946 },
                    // 'column-11': ['member_02'],
                    // 'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-24': [
                        '67da7c119675bccb963cc524',
                        '67da7c319675bccb963cc52b',
                        '67da7c419675bccb963cc52d',
                        '67da7c599675bccb963cc52f'
                    ],
                    'column-25': [],
                    'column-custom_demo':
                        '这是一个可滚动的容器示例\n内容区域比容器大，所以会显示滚动条 00000\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条\n内容区域比容器大，所以会显示滚动条',
                    'column-checkbox': true
                }
            }
        ],
        fields: [
            {
                _id: 'column-1',
                name: '单行文本',
                positions: {
                    view1: 0,
                    view2: 30
                },
                type: AITableFieldType.text,
                stat_type: AITableStatType.CountAll
            },
            {
                _id: 'column-custom_demo',
                name: '自定义字段',
                icon: 'ticket',
                positions: {
                    view1: 0.5,
                    view2: 31
                },
                type: AITableCustomFieldType.customDemo,
                stat_type: AITableStatType.CountAll
            },
            {
                _id: 'column-checkbox',
                name: '复选框',
                icon: 'check-square',
                positions: {
                    view1: 0.6,
                    view2: 31
                },
                type: AITableFieldType.checkbox,
                stat_type: AITableStatType.CountAll
            },
            {
                _id: 'column-13',
                name: '单行文本 2',
                positions: {
                    view1: 1,
                    view2: 28
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-5',
                name: '成员',
                positions: {
                    view1: 2,
                    view2: 26
                },
                settings: {
                    is_multiple: true
                },
                type: AITableFieldType.member
            },
            {
                _id: 'column-566',
                name: '单成员',
                positions: {
                    view1: 3,
                    view2: 24
                },
                widths: {
                    view1: 100,
                    view2: 100
                },
                settings: {
                    is_multiple: false
                },
                type: AITableFieldType.member
            },
            {
                _id: 'column-2',
                name: '单选',
                positions: {
                    view1: 4,
                    view2: 22
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    options: [
                        {
                            _id: '_id_1',
                            text: '开始',
                            color: '#5dcfff',
                            is_disabled: 1
                        },
                        {
                            _id: '_id_2',
                            text: '进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: '_id_3',
                            text: '已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-110',
                name: 'dot单选',
                positions: {
                    view1: 5,
                    view2: 20
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    option_style: AITableSelectOptionStyle.dot,
                    options: [
                        {
                            _id: 'dot_1',
                            text: '开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始',
                            color: '#5dcfff'
                        },
                        {
                            _id: 'dot_2',
                            text: '进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: 'dot_3',
                            text: '已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-111',
                name: 'piece单选',
                positions: {
                    view1: 6,
                    view2: 18
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    option_style: AITableSelectOptionStyle.piece,
                    options: [
                        {
                            _id: 'piece_1',
                            text: '开始',
                            color: '#5dcfff'
                        },
                        {
                            _id: 'piece_2',
                            text: '进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: 'piece_3',
                            text: '已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-112',
                name: 'tag单选',
                positions: {
                    view1: 7,
                    view2: 16
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    option_style: AITableSelectOptionStyle.tag,
                    options: [
                        {
                            _id: 'tag_1',
                            text: '开',
                            color: '#5dcfff'
                        },
                        {
                            _id: 'tag_2',
                            text: '进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: 'tag_3',
                            text: '已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成',
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
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                },
                positions: {
                    view1: 8,
                    view2: 15
                }
            },
            {
                _id: 'column-3',
                name: '数字',
                positions: {
                    view1: 9,
                    view2: 14
                },
                type: AITableFieldType.number
            },
            {
                _id: 'column-4',
                name: '日期',
                positions: {
                    view1: 10,
                    view2: 13
                },
                type: AITableFieldType.date
            },
            {
                _id: 'column-6',
                name: '进度',
                positions: {
                    view1: 11,
                    view2: 12
                },
                type: AITableFieldType.progress
            },
            {
                _id: 'column-7',
                name: '评分',
                positions: {
                    view1: 12,
                    view2: 11
                },
                type: AITableFieldType.rate
            },
            {
                _id: 'column-8',
                name: '链接',
                positions: {
                    view1: 13,
                    view2: 10
                },
                type: AITableFieldType.link
            },
            {
                _id: 'column-9',
                name: '创建人',
                positions: {
                    view1: 14,
                    view2: 9
                },
                type: AITableFieldType.createdBy
            },
            {
                _id: 'column-10',
                name: '创建时间',
                positions: {
                    view1: 15,
                    view2: 8
                },
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-11',
                name: '更新人',
                positions: {
                    view1: 16,
                    view2: 7
                },
                type: AITableFieldType.updatedBy
            },
            {
                _id: 'column-12',
                name: '更新时间',
                positions: {
                    view1: 17,
                    view2: 6
                },
                type: AITableFieldType.updatedAt
            },
            {
                _id: 'column-21',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选 piece',
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
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                },
                positions: {
                    view1: 18,
                    view2: 5
                }
            },
            {
                _id: 'column-22',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选 dot',
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
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                },
                positions: {
                    view1: 19,
                    view2: 4
                }
            },
            {
                _id: 'column-23',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选 text',
                settings: {
                    is_multiple: true,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                },
                positions: {
                    view1: 20,
                    view2: 3
                }
            },
            {
                _id: 'column-24',
                type: AITableFieldType.attachment,
                icon: 'attachment',
                name: '附件',
                settings: {},
                positions: {
                    view1: 21,
                    view2: 2
                }
            },
            {
                _id: 'column-25',
                type: AITableFieldType.richText,
                icon: 'multiline-text',
                name: '多行文本',
                settings: {},
                positions: {
                    view1: 22,
                    view2: 1
                }
            }
        ]
    };
    return initValue;
}

export function getBigData() {
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [],
        fields: []
    };

    console.time('build data');
    initValue.fields = getDefaultAITableValue().fields;
    initValue.records = [];
    for (let index = 0; index < 500000; index++) {
        initValue.records.push({
            _id: `row-${index + 1}`,
            short_id: `row-short-id-${index + 1}`,
            ...getDefaultTrackableEntity(),
            positions: { view1: index, view2: index },
            values: {
                'column-1': '文本 2-1',
                'column-13': '文本 2-1',
                'column-2': ['_id_2'],
                'column-110': ['dot_2'],
                'column-111': ['piece_2'],
                'column-112': ['tag_2'],
                'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                'column-3': 10,
                'column-4': { timestamp: 1682235946 },
                'column-5': ['member_01', 'member_02'],
                'column-6': 50,
                'column-7': 3,
                'column-8': {}
                // 'column-9': ['member_01'],
                // 'column-10': { timestamp: 1682235946 },
                // 'column-11': ['member_02'],
                // 'column-12': { timestamp: 1720490727 }
            }
        });
    }
    console.timeEnd('build data');
    return initValue;
}

export function getReferences(): AITableCustomReferences {
    return {
        members: {
            member_01: {
                uid: 'member_01',
                display_name: 'admin',
                display_name_pinyin: 'admin',
                avatar: 'https://s3.cn-north-1.amazonaws.com.cn/lcavatar/d242cf52-c1d1-4e95-a113-a7d30b0ede74_80x80.png'
            },
            member_02: {
                uid: 'member_02',
                display_name: 'member',
                display_name_pinyin: 'member',
                avatar: ''
            },
            member_03: {
                uid: 'member_03',
                display_name: 'Maple13',
                display_name_pinyin: 'Maple13',
                avatar: ''
            },
            member_04: {
                uid: 'member_04',
                display_name: 'canvas',
                display_name_pinyin: 'canvas',
                avatar: ''
            },
            member_05: {
                uid: 'member_05',
                display_name: '虾米',
                display_name_pinyin: 'xiami',
                avatar: ''
            },
            member_06: {
                uid: 'member_06',
                display_name: 'html',
                display_name_pinyin: 'html',
                avatar: ''
            },
            member_07: {
                uid: 'member_07',
                display_name: 'css',
                display_name_pinyin: 'css',
                avatar: ''
            },
            member_08: {
                uid: 'member_08',
                display_name: 'Angular',
                display_name_pinyin: 'Angular',
                avatar: ''
            }
        },
        attachments: {
            '676e3e9b5660cd68d7f49e60': {
                _id: '676e3e9b5660cd68d7f49e60',
                title: '2222.docx',
                addition: {
                    ext: 'docx',
                    path: 'baa7652b-e2ad-447f-b086-d4a929ae079a',
                    size: 9962
                }
            },
            '67da7c119675bccb963cc524': {
                _id: '67da7c119675bccb963cc524',
                title: '1.xlsx',
                addition: {
                    ext: 'xlsx',
                    path: '43ca5702-7608-4649-bb12-f0620e0f4895',
                    size: 17634
                }
            },
            '67da7c319675bccb963cc52b': {
                _id: '67da7c319675bccb963cc52b',
                title: '[FZai]-桌面86底盒（标准）.3mf',

                addition: {
                    ext: '3mf',
                    path: 'a64eddaf-a70e-46b6-b2fa-3baaac19f6a8',
                    size: 1356157
                }
            },
            '67da7c419675bccb963cc52d': {
                _id: '67da7c419675bccb963cc52d',
                title: '【2023.2.16】版本比对UI设计 (1).zip',
                addition: {
                    ext: 'zip',
                    path: 'fb4bf273-0d98-49ce-9dfa-53f197bdbd40',
                    size: 1815883
                }
            },
            '67da7c599675bccb963cc52f': {
                _id: '67da7c599675bccb963cc52f',
                title: '1 (1).pdf',
                addition: {
                    ext: 'pdf',
                    path: '5ff9237d-45da-49fd-9f14-40102a0d7c2a',
                    size: 798825
                }
            },
            '67da80d89675bccb963cc588': {
                _id: '67da80d89675bccb963cc588',
                title: '1.png',
                addition: {
                    ext: 'png',
                    path: '41b43419-3f06-44b0-852d-8d1d9200742b',
                    size: 23511
                }
            },
            '67da80f09675bccb963cc58a': {
                _id: '67da80f09675bccb963cc58a',
                title: '7f65ce5b1c.m3u',
                addition: {
                    ext: 'm3u',
                    path: '23fc1590-0d8f-4e03-8bb2-3feb02f9ebaa',
                    size: 2626981
                }
            },
            '67da81429675bccb963cc596': {
                _id: '67da81429675bccb963cc596',
                title: '51683696422_.pic_hd.jpg',
                addition: {
                    ext: 'jpg',
                    path: '8a5f7b97-d515-4d73-9c20-141c88e41828',
                    size: 2474023
                }
            }
        },
        relations: {
            '67da7c119675bccb963cc52r': {
                _id: '67da7c119675bccb963cc52r',
                title: '关联项标题超级长长长长长长长长长',
                whole_identifier: 'ICE-T66'
            },
            '67da7c119675bccb963cc52y': {
                _id: '67da7c119675bccb963cc52y',
                title: '关联项2',
                whole_identifier: 'ICE-T99999'
            }
        }
    };
}

export function getBasicData() {
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [
            {
                _id: 'row-1',
                short_id: `row-short-id-${1}`,
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 0
                },
                values: {
                    'column-text': '这是一个单行文本字段示例',
                    'column-select': ['option_1'],
                    'column-checkbox': true
                }
            },
            {
                _id: 'row-2',
                short_id: `row-short-id-${2}`,
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 65536
                },
                values: {
                    'column-text': '第二行的文本内容',
                    'column-select': ['option_2'],
                    'column-checkbox': false
                }
            },
            {
                _id: 'row-3',
                short_id: `row-short-id-${3}`,
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 65536 * 2
                },
                values: {
                    'column-text': '第三行的文本内容',
                    'column-select': ['option_3'],
                    'column-checkbox': true
                }
            }
        ],
        fields: [
            {
                _id: 'column-text',
                type: AITableFieldType.text,
                icon: 'text',
                name: '单行文本',
                settings: {},
                positions: {
                    view1: 0
                }
            },
            {
                _id: 'column-select',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '单选',
                settings: {
                    is_multiple: false,
                    options: [
                        {
                            text: '选项一',
                            bg_color: '#E48483',
                            _id: 'option_1'
                        },
                        {
                            text: '选项二',
                            bg_color: '#E0B75D',
                            _id: 'option_2'
                        },
                        {
                            text: '选项三',
                            bg_color: '#69B1E4',
                            _id: 'option_3'
                        }
                    ]
                },
                positions: {
                    view1: 65536
                }
            },
            {
                _id: 'column-checkbox',
                type: AITableFieldType.checkbox,
                icon: 'checkbox',
                name: '复选框',
                settings: {},
                positions: {
                    view1: 65536 * 2
                }
            }
        ]
    };

    return initValue;
}

export const LOCAL_STORAGE_DATA_MODE = 'ai-table-demo-data-mode';
export const LOCAL_STORAGE_AI_TABLE_DATA = 'ai-table-demo-data';

export function getAITAbleDataLocalStorage() {
    const data = localStorage.getItem(LOCAL_STORAGE_AI_TABLE_DATA);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}
