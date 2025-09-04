import { getSortRecords } from '../../../utils/record/sort';
import { AITableFieldType, AITableView, AITableViewRecords, SortDirection, AITableGroupOptions, AITableGroupField } from '@ai-table/utils';
import { AITable, AITableQueries, FieldModelMap } from '@ai-table/grid';

describe('Record sort test', () => {
    let mockAITable: jasmine.SpyObj<AITable>;
    let mockRecords: AITableViewRecords;
    let mockActiveView: AITableView;

    beforeEach(() => {
        // 创建 mock records
        mockRecords = [
            {
                _id: 'record1',
                short_id: 'r1',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: { field1: 'B', field2: 10 },
                positions: { view1: 2 }
            },
            {
                _id: 'record2',
                short_id: 'r2',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: { field1: 'A', field2: 20 },
                positions: { view1: 1 }
            },
            {
                _id: 'record3',
                short_id: 'r3',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: { field1: 'C', field2: 5 },
                positions: { view1: 3 }
            }
        ];

        // 创建 mock view
        mockActiveView = {
            _id: 'view1',
            short_id: 'v1',
            name: 'Test View',
            settings: {}
        };

        // 创建 mock AITable
        mockAITable = jasmine.createSpyObj('AITable', ['fieldsMap', 'context']);

        // 设置 mock fieldsMap
        const mockFieldsMap = {
            field1: {
                _id: 'field1',
                short_id: 'f1',
                name: 'Field 1',
                type: AITableFieldType.text,
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1'
            },
            field2: {
                _id: 'field2',
                short_id: 'f2',
                name: 'Field 2',
                type: AITableFieldType.number,
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1'
            },
            field3: {
                _id: 'field3',
                short_id: 'f3',
                name: 'Field 3',
                type: AITableFieldType.text,
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1'
            }
        };

        mockAITable.fieldsMap.and.returnValue(mockFieldsMap);

        // 设置 mock context
        const mockContext = {
            references: jasmine.createSpy('references').and.returnValue({})
        };
        mockAITable.context = mockContext as any;

        // 模拟 getFieldValue 方法调用，让 getFieldValue 从当前模拟数据里获取数据
        spyOn(AITableQueries, 'getFieldValue').and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = mockRecords.find((r) => r._id === recordId);
            return record?.values[fieldId];
        });

        // 模拟 FieldModelMap 的 compare 方法
        spyOn(FieldModelMap[AITableFieldType.text], 'compare').and.callFake((value1: any, value2: any) => {
            if (value1 < value2) return -1;
            if (value1 > value2) return 1;
            return 0;
        });

        spyOn(FieldModelMap[AITableFieldType.number], 'compare').and.callFake((value1: any, value2: any) => {
            return value1 - value2;
        });
    });

    //  多条件组合排序，优先按照第一顺序排序，在第一顺序下再按第二顺序排，以此类推
    it('Sort first by the first order, and then by the second order under the first order', () => {
        const complexSortRecords = [
            { ...mockRecords[0], _id: 'record1', values: { field1: 'A', field2: 30, field3: 'Z' }, positions: { view1: 10 } },
            { ...mockRecords[1], _id: 'record2', values: { field1: 'A', field2: 20, field3: 'Y' }, positions: { view1: 20 } },
            { ...mockRecords[2], _id: 'record3', values: { field1: 'A', field2: 20, field3: 'X' }, positions: { view1: 30 } },
            { ...mockRecords[0], _id: 'record4', values: { field1: 'B', field2: 10, field3: 'W' }, positions: { view1: 40 } },
            { ...mockRecords[1], _id: 'record5', values: { field1: 'B', field2: 10, field3: 'V' }, positions: { view1: 50 } }
        ];

        (AITableQueries.getFieldValue as jasmine.Spy).and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = complexSortRecords.find((r) => r._id === recordId);
            return record?.values[fieldId as keyof typeof record.values];
        });

        mockActiveView.settings = {
            sorts: [
                {
                    sort_by: 'field1', // 第一优先级：A < B
                    direction: SortDirection.ascending
                },
                {
                    sort_by: 'field2', // 第二优先级：30 > 20 > 10（降序）
                    direction: SortDirection.descending
                },
                {
                    sort_by: 'field3', // 第三优先级：X < Y < Z（升序）
                    direction: SortDirection.ascending
                }
            ]
        };

        const result = getSortRecords(mockAITable, complexSortRecords, mockActiveView);
        // 预期排序结果：
        // 1. record1: A, 30, Z
        // 2. record3: A, 20, X
        // 3. record2: A, 20, Y
        // 4. record5: B, 10, V
        // 5. record4: B, 10, W
        expect(result[0]._id).toBe('record1');
        expect(result[1]._id).toBe('record3');
        expect(result[2]._id).toBe('record2');
        expect(result[3]._id).toBe('record5');
        expect(result[4]._id).toBe('record4');
    });

    // 自动排序开启 is_keep_sort=true，则实时排序，新增数据自动排序，自动排序关闭，则需要重新调用排序
    it('When automatic sorting has is_keep_sort=true, newly added data should be automatically sorted', () => {
        const recordsWithNewData = [
            { ...mockRecords[0], values: { field1: 'C' }, positions: { view1: 1 } },
            { ...mockRecords[1], values: { field1: 'A' }, positions: { view1: 2 } },
            { ...mockRecords[2], values: { field1: 'B' }, positions: { view1: 3 } }
        ];

        (AITableQueries.getFieldValue as jasmine.Spy).and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = recordsWithNewData.find((r) => r._id === recordId);
            return record?.values[fieldId as keyof typeof record.values];
        });

        mockActiveView.settings = {
            is_keep_sort: true,
            sorts: [
                {
                    sort_by: 'field1',
                    direction: SortDirection.descending
                }
            ]
        };

        const result = getSortRecords(mockAITable, recordsWithNewData, mockActiveView);

        expect(result[0].values['field1']).toBe('C');
        expect(result[1].values['field1']).toBe('B');
        expect(result[2].values['field1']).toBe('A');
        recordsWithNewData.push({ ...mockRecords[0], _id: 'record0', short_id: 'r0', values: { field1: 'D' }, positions: { view1: 4 } });
        const result2 = getSortRecords(mockAITable, recordsWithNewData, mockActiveView);
        expect(result2[0].values['field1']).toBe('D');
    });

    // 开启自动排序后插入空行默认放到最前，关闭后在保持在前
    it('When automatic sorting is enabled, inserting a blank row is placed at the beginning by default, and it remains at the beginning when automatic sorting is disabled', () => {
        const recordsWithEmpty = [
            { ...mockRecords[0], values: { field1: 'B' }, positions: { view1: 1 } },
            { ...mockRecords[1], values: { field1: '' }, positions: { view1: 2 } }, // 空值记录
            { ...mockRecords[2], values: { field1: 'A' }, positions: { view1: 3 } }
        ];

        (AITableQueries.getFieldValue as jasmine.Spy).and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = recordsWithEmpty.find((r) => r._id === recordId);
            return record?.values[fieldId as keyof typeof record.values];
        });

        mockActiveView.settings = {
            is_keep_sort: true,
            sorts: [
                {
                    sort_by: 'field1',
                    direction: SortDirection.ascending
                }
            ]
        };

        const autoSortResult = getSortRecords(mockAITable, recordsWithEmpty, mockActiveView);

        expect(autoSortResult[0].values['field1']).toBe(''); // 空值在前
        expect(autoSortResult[1].values['field1']).toBe('A');
        expect(autoSortResult[2].values['field1']).toBe('B');

        // 测试关闭自动排序
        mockActiveView.settings = {
            is_keep_sort: false,
            sorts: [
                {
                    sort_by: 'field1',
                    direction: SortDirection.ascending
                }
            ]
        };

        const manualSortResult = getSortRecords(mockAITable, recordsWithEmpty, mockActiveView);
        expect(manualSortResult[0].values['field1']).toBe(''); // 空值在前
    });

    // 开启自动排序后，清除自动排序后要恢复到上一次手动拖拽顺序
    it('When automatic sorting is enabled, clearing automatic sorting should restore the last manual drag-and-drop order', () => {
        const recordsWithManualPosition = [
            { ...mockRecords[0], values: { field1: 'A' }, positions: { view1: 3 } },
            { ...mockRecords[1], values: { field1: 'B' }, positions: { view1: 1 } },
            { ...mockRecords[2], values: { field1: 'C' }, positions: { view1: 2 } }
        ];

        (AITableQueries.getFieldValue as jasmine.Spy).and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = recordsWithManualPosition.find((r) => r._id === recordId);
            return record?.values[fieldId as keyof typeof record.values];
        });

        // 开启自动排序
        mockActiveView.settings = {
            is_keep_sort: true,
            sorts: [
                {
                    sort_by: 'field1',
                    direction: SortDirection.ascending
                }
            ]
        };

        const autoSortResult = getSortRecords(mockAITable, recordsWithManualPosition, mockActiveView);

        // 自动排序：A, B, C
        expect(autoSortResult[0].values['field1']).toBe('A');
        expect(autoSortResult[1].values['field1']).toBe('B');
        expect(autoSortResult[2].values['field1']).toBe('C');

        // 清除自动排序
        mockActiveView.settings = {
            is_keep_sort: false,
            sorts: [] // 清除排序规则
        };

        const manualSortResult = getSortRecords(mockAITable, recordsWithManualPosition, mockActiveView);

        // 按position排序 B(1), C(2), A(3)
        expect(manualSortResult[0]._id).toBe('record2'); // position=1
        expect(manualSortResult[1]._id).toBe('record3'); // position=2
        expect(manualSortResult[2]._id).toBe('record1'); // position=3
    });
});

describe('Grouping sorting test', () => {
    let mockAITable: jasmine.SpyObj<AITable>;
    let mockRecords: AITableViewRecords;
    let mockActiveView: AITableView;

    beforeEach(() => {
        mockRecords = [
            {
                _id: 'record1',
                short_id: 'r1',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: {
                    department: '技术部',
                    level: '高级',
                    name: '张三',
                    score: 95
                },
                positions: { view1: 1 }
            },
            {
                _id: 'record2',
                short_id: 'r2',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: {
                    department: '技术部',
                    level: '中级',
                    name: '李四',
                    score: 88
                },
                positions: { view1: 2 }
            },
            {
                _id: 'record3',
                short_id: 'r3',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: {
                    department: '产品部',
                    level: '高级',
                    name: '王五',
                    score: 92
                },
                positions: { view1: 3 }
            },
            {
                _id: 'record4',
                short_id: 'r4',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: {
                    department: '产品部',
                    level: '中级',
                    name: '赵六',
                    score: 85
                },
                positions: { view1: 4 }
            },
            {
                _id: 'record5',
                short_id: 'r5',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: {
                    department: '市场部',
                    level: '初级',
                    name: '钱七',
                    score: 78
                },
                positions: { view1: 5 }
            },
            {
                _id: 'record6',
                short_id: 'r6',
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1',
                values: {
                    department: '技术部',
                    level: '高级',
                    name: '孙八',
                    score: 97
                },
                positions: { view1: 6 }
            }
        ];

        // 创建 mock view
        mockActiveView = {
            _id: 'view1',
            short_id: 'v1',
            name: 'Test View',
            settings: {}
        };

        // 创建 mock AITable
        mockAITable = jasmine.createSpyObj('AITable', ['fieldsMap', 'context']);

        // 设置 mock fieldsMap
        const mockFieldsMap = {
            department: {
                _id: 'department',
                short_id: 'dept',
                name: '部门',
                type: AITableFieldType.text,
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1'
            },
            level: {
                _id: 'level',
                short_id: 'lvl',
                name: '级别',
                type: AITableFieldType.text,
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1'
            },
            name: {
                _id: 'name',
                short_id: 'nm',
                name: '姓名',
                type: AITableFieldType.text,
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1'
            },
            score: {
                _id: 'score',
                short_id: 'sc',
                name: '分数',
                type: AITableFieldType.number,
                created_at: Date.now(),
                updated_at: Date.now(),
                created_by: 'user1',
                updated_by: 'user1'
            }
        };

        mockAITable.fieldsMap.and.returnValue(mockFieldsMap);

        // 设置 mock context
        const mockContext = {
            references: jasmine.createSpy('references').and.returnValue({})
        };
        mockAITable.context = mockContext as any;

        // Mock AITableQueries.getFieldValue
        spyOn(AITableQueries, 'getFieldValue').and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = mockRecords.find((r) => r._id === recordId);
            return record?.values[fieldId];
        });

        // Mock FieldModelMap的compare方法
        spyOn(FieldModelMap[AITableFieldType.text], 'compare').and.callFake((value1: any, value2: any) => {
            if (value1 < value2) return -1;
            if (value1 > value2) return 1;
            return 0;
        });

        spyOn(FieldModelMap[AITableFieldType.number], 'compare').and.callFake((value1: any, value2: any) => {
            return value1 - value2;
        });
    });

    // 一级分组：按部门分组，数据应按部门顺序排列
    it('One level grouping: Group by department, data should be sorted by department order', () => {
        const groups: AITableGroupField[] = [
            {
                field_id: 'department',
                direction: SortDirection.ascending
            }
        ];

        mockActiveView.settings = {
            groups
        };

        const result = getSortRecords(mockAITable, mockRecords, mockActiveView);

        const departmentOrder = result.map((r) => r.values['department']);
        // 分组顺序
        const firstProductIndex = departmentOrder.indexOf('产品部');
        const firstMarketIndex = departmentOrder.indexOf('市场部');
        const firstTechIndex = departmentOrder.indexOf('技术部');

        expect(firstProductIndex).toBeLessThan(firstMarketIndex);
        expect(firstMarketIndex).toBeLessThan(firstTechIndex);
    });

    // 二级分组：按部门和级别分组，数据应按部门和级别顺序排列
    it('Two-level grouping: Group by department and level, data should be sorted by department and level order', () => {
        const groups: AITableGroupField[] = [
            {
                field_id: 'department',
                direction: SortDirection.ascending
            },
            {
                field_id: 'level',
                direction: SortDirection.descending // 级别降序：高级 > 中级 > 初级
            }
        ];

        mockActiveView.settings = {
            groups
        };

        const result = getSortRecords(mockAITable, mockRecords, mockActiveView);

        // 产品部-高级 -> 产品部-中级 -> 市场部-初级 -> 技术部-高级 -> 技术部-中级
        expect(result[0].values['department']).toBe('产品部');
        expect(result[0].values['level']).toBe('高级');

        expect(result[1].values['department']).toBe('产品部');
        expect(result[1].values['level']).toBe('中级');

        expect(result[2].values['department']).toBe('市场部');
        expect(result[2].values['level']).toBe('初级');

        // 技术部先是高级，然后是中级
        const techRecords = result.filter((r) => r.values['department'] === '技术部');
        expect(techRecords[0].values['level']).toBe('高级');
        expect(techRecords[2].values['level']).toBe('中级');
    });

    // 三级分组：按部门、级别和姓名分组，数据应按部门、级别和姓名顺序排列
    it('Three-level grouping: Group by department, level, and name, data should be sorted by department, level, and name order', () => {
        const groups: AITableGroupField[] = [
            {
                field_id: 'department',
                direction: SortDirection.ascending
            },
            {
                field_id: 'level',
                direction: SortDirection.descending
            },
            {
                field_id: 'name',
                direction: SortDirection.ascending
            }
        ];

        mockActiveView.settings = {
            groups
        };

        const result = getSortRecords(mockAITable, mockRecords, mockActiveView);

        // 技术部-高级组内，按姓名升序排列：孙八 < 张三
        const techSeniorRecords = result.filter((r) => r.values['department'] === '技术部' && r.values['level'] === '高级');

        expect(techSeniorRecords.length).toBe(2);
        expect(techSeniorRecords[0].values['name']).toBe('孙八');
        expect(techSeniorRecords[1].values['name']).toBe('张三');
    });

    // 多组分组和排序条件：应按分组 > 排序的优先级进行排序
    it('Multiple grouping and sorting conditions: Grouping priority should be higher than sorting', () => {
        const groups: AITableGroupField[] = [
            {
                field_id: 'department',
                direction: SortDirection.ascending
            }
        ];

        mockActiveView.settings = {
            groups,
            sorts: [
                {
                    sort_by: 'score',
                    direction: SortDirection.descending // 分数降序
                }
            ]
        };

        const result = getSortRecords(mockAITable, mockRecords, mockActiveView);

        // 首先按部门分组
        const departments = result.map((r) => r.values['department']);
        const firstProductIndex = departments.indexOf('产品部');
        const firstMarketIndex = departments.indexOf('市场部');
        const firstTechIndex = departments.indexOf('技术部');

        expect(firstProductIndex).toBeLessThan(firstMarketIndex);
        expect(firstMarketIndex).toBeLessThan(firstTechIndex);

        // 在每个部门内，按分数降序排列
        const techRecords = result.filter((r) => r.values['department'] === '技术部');
        const techScores = techRecords.map((r) => r.values['score']);

        // 技术部内分数应该是降序：97 > 95 > 88
        expect(techScores[0]).toBe(97); // 孙八
        expect(techScores[1]).toBe(95); // 张三
        expect(techScores[2]).toBe(88); // 李四
    });

    // 多组分组、排序条件和位置：应按分组 > 排序 > 位置的优先级进行排序
    it('Multiple grouping, sorting conditions, and positions: Should sort by grouping > sorting > position priority', () => {
        const recordsWithPosition = mockRecords.map((record) => ({
            ...record,
            positions: {
                view1:
                    record._id === 'record1'
                        ? 100 // 张三位置最大
                        : record._id === 'record6'
                          ? 1 // 孙八位置最小
                          : record.positions?.['view1'] || 50
            }
        }));

        const groups: AITableGroupField[] = [
            {
                field_id: 'department',
                direction: SortDirection.ascending
            }
        ];

        mockActiveView.settings = {
            groups,
            sorts: [
                {
                    sort_by: 'level',
                    direction: SortDirection.descending
                }
            ],
            is_keep_sort: false // 取消自动排序
        };

        (AITableQueries.getFieldValue as jasmine.Spy).and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = recordsWithPosition.find((r) => r._id === recordId);
            return record?.values[fieldId];
        });

        const result = getSortRecords(mockAITable, recordsWithPosition, mockActiveView);

        // 分组优先级：部门分组
        const departments = result.map((r) => r.values['department']);
        expect(departments.indexOf('产品部')).toBeLessThan(departments.indexOf('技术部'));

        // 排序优先级：级别降序
        const techRecords = result.filter((r) => r.values['department'] === '技术部');
        const techLevels = techRecords.map((r) => r.values['level']);

        // 技术部先是高级，再是中级
        const seniorIndices = [];
        const middleIndices = [];

        for (let i = 0; i < techLevels.length; i++) {
            if (techLevels[i] === '高级') seniorIndices.push(i);
            if (techLevels[i] === '中级') middleIndices.push(i);
        }

        expect(Math.max(...seniorIndices)).toBeLessThan(Math.min(...middleIndices));

        // 在同一部门、同一级别内，验证位置排序：孙八(position=1) 应该在 张三(position=100) 前面
        const techSeniorRecords = techRecords.filter((r) => r.values['level'] === '高级');
        expect(techSeniorRecords[0]._id).toBe('record6'); // 孙八，position=1
        expect(techSeniorRecords[1]._id).toBe('record1'); // 张三，position=100
    });

    // 删除分组后，应该恢复到分组前的排序状态
    it('Delete grouping should restore to the sorting state before grouping', () => {
        mockActiveView.settings = {
            sorts: [
                {
                    sort_by: 'score',
                    direction: SortDirection.descending
                }
            ]
        };

        const initialResult = getSortRecords(mockAITable, mockRecords, mockActiveView);
        const initialOrder = initialResult.map((r) => r._id);

        const groups: AITableGroupField[] = [
            {
                field_id: 'department',
                direction: SortDirection.ascending
            }
        ];

        mockActiveView.settings = {
            groups,
            sorts: [
                {
                    sort_by: 'score',
                    direction: SortDirection.descending
                }
            ]
        };

        const groupedResult = getSortRecords(mockAITable, mockRecords, mockActiveView);
        const groupedOrder = groupedResult.map((r) => r._id);

        expect(groupedOrder).not.toEqual(initialOrder);

        mockActiveView.settings = {
            sorts: [
                {
                    sort_by: 'score',
                    direction: SortDirection.descending
                }
            ]
        };

        const restoredResult = getSortRecords(mockAITable, mockRecords, mockActiveView);
        const restoredOrder = restoredResult.map((r) => r._id);

        // 删除分组后恢复到初始排序状态
        expect(restoredOrder).toEqual(initialOrder);

        // 按分数降序
        const scores = restoredResult.map((r) => r.values['score']);
        expect(scores[0]).toBe(97); // 最高分
        expect(scores[scores.length - 1]).toBe(78); // 最低分
    });

    // 删除分组后，应该恢复到位置排序
    it('Delete grouping, if no other sorting conditions, should restore to position sorting', () => {
        const recordsWithPosition = mockRecords.map((record, index) => ({
            ...record,
            positions: { view1: index * 10 + 1 } // 1, 11, 21, 31, 41, 51
        }));

        const groups: AITableGroupField[] = [
            {
                field_id: 'department',
                direction: SortDirection.descending
            }
        ];

        mockActiveView.settings = {
            groups
        };

        (AITableQueries.getFieldValue as jasmine.Spy).and.callFake((aiTable, path) => {
            const [recordId, fieldId] = path;
            const record = recordsWithPosition.find((r) => r._id === recordId);
            return record?.values[fieldId];
        });

        const groupedResult = getSortRecords(mockAITable, recordsWithPosition, mockActiveView);

        mockActiveView.settings = {};

        const ungroupedResult = getSortRecords(mockAITable, recordsWithPosition, mockActiveView);

        const positions = ungroupedResult.map((r) => r.positions!['view1']);

        // positions应该是升序：1, 11, 21, 31, 41, 51
        for (let i = 1; i < positions.length; i++) {
            expect(positions[i]).toBeGreaterThan(positions[i - 1]);
        }
    });
});
