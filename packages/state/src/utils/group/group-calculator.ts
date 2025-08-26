import { AITable, AITableLinearRowGroup, AITableQueries, FieldModelMap } from '@ai-table/grid';
import { AITableGroups, AITableViewRecords, AITableViewFields, AITableViewField, AITableViewRecord } from '@ai-table/utils';
import { AITableLinearRow, AITableRowType } from '@ai-table/grid';
import { nanoid } from 'nanoid';

export class GroupCalculator {
    private groups: AITableGroups;
    private groupBreakpoints: Map<string, number[]>;
    private groupCollapseState: Set<string>;
    private aiTable: AITable;

    constructor(groups: AITableGroups, aiTable: AITable, collapseState?: string[]) {
        this.groups = groups;
        this.groupBreakpoints = new Map();
        this.groupCollapseState = new Set(collapseState || []);
        this.aiTable = aiTable;
    }

    calculateLinearRows(records: AITableViewRecords, fields: AITableViewFields): AITableLinearRow[] {
        const sortedRecords = this.sortRecordsByGroup(records, fields);

        this.detectGroupBreakpoints(sortedRecords, fields);

        return this.generateLinearRows(sortedRecords, fields);
    }

    private sortRecordsByGroup(records: AITableViewRecords, fields: AITableViewFields): AITableViewRecords {
        const fieldsMap = new Map(fields.map((field) => [field._id, field]));

        return [...records].sort((record1, record2) => {
            return (
                this.groups.reduce((result, groupField) => {
                    if (result !== 0) return result;

                    const field = fieldsMap.get(groupField.fieldId);
                    if (!field) return 0;

                    const value1 = AITableQueries.getFieldValue(this.aiTable, [record1._id, field._id]);
                    const value2 = AITableQueries.getFieldValue(this.aiTable, [record2._id, field._id]);

                    const fieldModel = FieldModelMap[field.type];
                    if (!fieldModel) return 0;

                    const compareResult = fieldModel.compare(value1, value2, this.aiTable.context!.references(), undefined, {
                        aiTable: this.aiTable,
                        field
                    });

                    return compareResult * (groupField.desc ? -1 : 1);
                }, 0) || 1
            );
        });
    }

    // 检测断点
    private detectGroupBreakpoints(records: AITableViewRecords, fields: AITableViewFields): void {
        this.groupBreakpoints.clear();

        if (records.length === 0) return;

        const fieldsMap = new Map(fields.map((field) => [field._id, field]));
        let previousRecord: AITableViewRecord | null = null;

        records.forEach((record, index) => {
            if (previousRecord === null) {
                // 第一条记录，所有分组字段都是断点
                this.groups.forEach((groupField) => {
                    this.addBreakpoint(groupField.fieldId, index);
                });
            } else {
                // 检查每个分组字段是否发生变化
                this.groups.forEach((groupField, groupIndex) => {
                    const field = fieldsMap.get(groupField.fieldId);
                    if (!field) return;

                    const prevValue = AITableQueries.getFieldValue(this.aiTable, [previousRecord!._id, field._id]);
                    const currValue = AITableQueries.getFieldValue(this.aiTable, [record._id, field._id]);

                    const fieldModel = FieldModelMap[field.type];
                    if (!fieldModel) return;

                    const compareResult = fieldModel.compare(prevValue, currValue, this.aiTable.context!.references(), undefined, {
                        aiTable: this.aiTable,
                        field
                    });

                    if (compareResult !== 0) {
                        // 值发生变化，从当前层级开始的所有层级都是断点
                        for (let i = groupIndex; i < this.groups.length; i++) {
                            this.addBreakpoint(this.groups[i].fieldId, index);
                        }
                        return;
                    }
                });
            }

            previousRecord = record;
        });
    }

    // 添加断点
    private addBreakpoint(fieldId: string, recordIndex: number): void {
        if (!this.groupBreakpoints.has(fieldId)) {
            this.groupBreakpoints.set(fieldId, []);
        }
        const breakpoints = this.groupBreakpoints.get(fieldId)!;
        if (!breakpoints.includes(recordIndex)) {
            breakpoints.push(recordIndex);
        }
    }

    // 生成GroupLinearRows
    private generateLinearRows(records: AITableViewRecords, fields: AITableViewFields): AITableLinearRow[] {
        const linearRows: AITableLinearRow[] = [];
        const fieldsMap = new Map(fields.map((field) => [field._id, field]));
        let lastGroupDepth = -1;
        let currentGroupRecords: AITableViewRecord[] = [];
        let currentGroupIds: string[] = [];
        let currentGroupRecordIndices: number[] = []; // 记录当前分组中每个记录的原始索引

        // 开始添加一个空白行
        linearRows.push({
            type: AITableRowType.blank,
            _id: nanoid(),
            depth: 0
        });

        records.forEach((record, index) => {
            // 生成分组标签
            const groupTabRows = this.generateGroupTabRows(record, index, fieldsMap);

            if (groupTabRows.length > 0) {
                // 如果有新的分组标签，先处理上一个分组的结束
                if (currentGroupRecords.length > 0) {
                    this.handleGroupEnd(currentGroupRecords, linearRows, currentGroupIds, currentGroupRecordIndices);
                    currentGroupRecords = [];
                    currentGroupRecordIndices = [];
                }
                currentGroupIds = groupTabRows.map((row) => row.groupId);

                const depths = groupTabRows.filter((d) => d.depth !== undefined).map((d) => d.depth) as number[];
                const minDepth = depths.length > 0 ? Math.min(...depths) : 0;

                // 如果当前分组的最小深度小于等于上一个分组的深度，说明是同级或上级分组，需添加空白行
                if (lastGroupDepth >= 0 && minDepth <= lastGroupDepth) {
                    linearRows.push({
                        type: AITableRowType.blank,
                        _id: nanoid(),
                        depth: minDepth
                    });
                }

                // 只添加未被父级折叠的分组
                const visibleGroupTabRows = this.filterVisibleGroupTabs(groupTabRows);
                linearRows.push(...visibleGroupTabRows);
                lastGroupDepth = depths.length > 0 ? Math.max(...depths) : 0;
            }

            // 将记录添加到当前分组
            currentGroupRecords.push(record);
            currentGroupRecordIndices.push(index);
        });

        // 处理最后一个分组
        if (currentGroupRecords.length > 0) {
            this.handleGroupEnd(currentGroupRecords, linearRows, currentGroupIds, currentGroupRecordIndices);
        }

        // 添加分组结束的空白行
        if (lastGroupDepth >= 0) {
            linearRows.push({
                type: AITableRowType.blank,
                _id: nanoid(),
                depth: 0
            });
        }

        return linearRows;
    }

    private handleGroupEnd(
        currentGroupRecords: AITableViewRecord[],
        linearRows: AITableLinearRow[],
        currentGroupIds?: string[],
        currentGroupRecordIndices?: number[]
    ): void {
        // 分组结束时添加该分组的记录和add行
        let groupDisplayRowIndex = 0;

        currentGroupRecords.forEach((record, i) => {
            const recordIndex = currentGroupRecordIndices?.[i] ?? 0;
            if (this.shouldShowRecord(record, recordIndex)) {
                groupDisplayRowIndex++;
                linearRows.push({
                    type: AITableRowType.record,
                    _id: record._id,
                    displayIndex: groupDisplayRowIndex,
                    depth: this.groups.length
                });
            }
        });

        // 分组未折叠，为每个分组添加add新增行
        if (currentGroupRecords.length > 0 && this.shouldShowAddRowForGroup(currentGroupIds)) {
            linearRows.push({
                type: AITableRowType.add,
                _id: '',
                depth: this.groups.length,
                recordId: currentGroupRecords[0]._id
            });
        }
    }

    // 生成分组标签
    private generateGroupTabRows(
        record: AITableViewRecord,
        recordIndex: number,
        fieldsMap: Map<string, AITableViewField>
    ): AITableLinearRowGroup[] {
        const groupTabRows: AITableLinearRowGroup[] = [];

        this.groups.forEach((groupField, depth) => {
            const breakpoints = this.groupBreakpoints.get(groupField.fieldId) || [];

            if (breakpoints.includes(recordIndex)) {
                const field = fieldsMap.get(groupField.fieldId);
                if (!field) return;

                const groupValue = AITableQueries.getFieldValue(this.aiTable, [record._id, field._id]);
                const breakpointIndex = breakpoints.indexOf(recordIndex);
                const groupId = this.generateGroupId(groupField.fieldId, depth, breakpointIndex);
                const recordCount = this.calculateGroupRecordCount(record, recordIndex, depth);

                groupTabRows.push({
                    type: AITableRowType.group,
                    _id: nanoid(),
                    depth,
                    fieldId: groupField.fieldId,
                    groupValue,
                    isCollapsed: this.groupCollapseState.has(groupId),
                    recordCount,
                    groupId
                });
            }
        });

        return groupTabRows;
    }

    // 生成分组ID
    private generateGroupId(fieldId: string, depth: number, breakpointIndex: number): string {
        // 通过字段ID、深度和断点索引确保唯一
        return `${fieldId}_${depth}_${breakpointIndex}`;
    }

    private calculateGroupRecordCount(_record: AITableViewRecord, _recordIndex: number, _depth: number): number {
        // TODO: 实现精确的分组记录数计算
        return 1;
    }

    private shouldShowRecord(_record: AITableViewRecord, recordIndex: number): boolean {
        for (let depth = 0; depth < this.groups.length; depth++) {
            const groupField = this.groups[depth];
            const breakpoints = this.groupBreakpoints.get(groupField.fieldId) || [];

            // 找到当前记录所属的分组断点
            let belongsToBreakpointIndex = -1;
            for (let i = breakpoints.length - 1; i >= 0; i--) {
                if (breakpoints[i] <= recordIndex) {
                    belongsToBreakpointIndex = i;
                    break;
                }
            }

            if (belongsToBreakpointIndex >= 0) {
                const groupId = this.generateGroupId(groupField.fieldId, depth, belongsToBreakpointIndex);
                if (this.groupCollapseState.has(groupId)) {
                    return false; // 父级分组被折叠，不显示记录
                }
            }
        }

        return true;
    }

    // 检查当前分组是否应该显示添加行
    private shouldShowAddRowForGroup(currentGroupIds?: string[]): boolean {
        if (!currentGroupIds || currentGroupIds.length === 0) {
            return true; // 默认显示
        }

        // 检查当前组的所有分组层级是否都展开
        for (const groupId of currentGroupIds) {
            if (this.groupCollapseState.has(groupId)) {
                return false; // 有层级被折叠，不显示添加行
            }
        }

        return true;
    }

    // 过滤可见的分组标签
    private filterVisibleGroupTabs(groupTabRows: AITableLinearRowGroup[]): AITableLinearRowGroup[] {
        const visibleRows: AITableLinearRowGroup[] = [];

        for (let i = 0; i < groupTabRows.length; i++) {
            const currentRow = groupTabRows[i];
            let show = true;

            // 检查当前分组标签的所有父级是否都展开
            const currentDepth = currentRow.depth ?? 0;
            for (let parentDepth = 0; parentDepth < currentDepth; parentDepth++) {
                // 找到同一记录索引下的父级分组ID
                const parentRow = groupTabRows.find((row) => row.depth === parentDepth);
                if (parentRow && this.groupCollapseState.has(parentRow.groupId)) {
                    show = false;
                    break;
                }
            }

            if (show) {
                visibleRows.push(currentRow);
            }
        }

        return visibleRows;
    }
}
