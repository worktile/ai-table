import { AITable, AITableLinearRowGroup, AITableQueries, FieldModelMap } from '@ai-table/grid';
import { AITableViewRecords, AITableViewRecord, AITableField, AITableGroupField } from '@ai-table/utils';
import { AITableLinearRow, AITableRowType } from '@ai-table/grid';
import { nanoid } from 'nanoid';

export class GroupCalculator {
    private groups: AITableGroupField[];
    private groupBreakpoints: Map<string, number[]>;
    private groupCollapseState: Set<string>;
    private aiTable: AITable;
    private fieldsMap: Record<string, AITableField>;

    constructor(aiTable: AITable, groups: AITableGroupField[], collapseState?: string[]) {
        this.aiTable = aiTable;
        this.groups = groups;
        this.groupBreakpoints = new Map();
        this.groupCollapseState = new Set(collapseState || []);
        this.fieldsMap = this.aiTable.fieldsMap();
    }

    calculateLinearRows(records: AITableViewRecords): AITableLinearRow[] {
        this.detectGroupBreakpoints(records);

        return this.generateLinearRows(records);
    }

    // 检测断点
    private detectGroupBreakpoints(records: AITableViewRecords): void {
        this.groupBreakpoints.clear();

        if (records.length === 0) return;

        let previousRecord: AITableViewRecord | null = null;

        records.forEach((record, index) => {
            if (previousRecord === null) {
                // 第一条记录，所有分组字段都是断点
                this.groups.forEach((groupField) => {
                    this.addBreakpoint(groupField.field_id, index);
                });
            } else {
                // 检查每个分组字段是否发生变化
                this.groups.forEach((groupField, groupIndex) => {
                    const field = this.fieldsMap[groupField.field_id];
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
                            this.addBreakpoint(this.groups[i].field_id, index);
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
    private generateLinearRows(records: AITableViewRecords): AITableLinearRow[] {
        const linearRows: AITableLinearRow[] = [];
        let lastGroupDepth = -1;
        let currentGroupRecords: AITableViewRecord[] = [];
        let currentGroupRecordIndices: number[] = []; // 记录当前分组中每个记录的原始索引

        // 开始添加一个空白行
        linearRows.push({
            type: AITableRowType.blank,
            _id: nanoid(),
            depth: 0
        });

        records.forEach((record, index) => {
            // 生成分组标签
            const groupTabRows = this.generateGroupTabRows(record, index, records.length);

            if (groupTabRows.length > 0) {
                // 如果有新的分组标签，先处理上一个分组的结束
                if (currentGroupRecords.length > 0) {
                    this.handleGroupEnd(currentGroupRecords, linearRows, currentGroupRecordIndices);
                    currentGroupRecords = [];
                    currentGroupRecordIndices = [];
                }

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

                linearRows.push(...groupTabRows);
                lastGroupDepth = depths.length > 0 ? Math.max(...depths) : 0;
            }

            // 将记录添加到当前分组
            currentGroupRecords.push(record);
            currentGroupRecordIndices.push(index);
        });

        // 处理最后一个分组
        if (currentGroupRecords.length > 0) {
            this.handleGroupEnd(currentGroupRecords, linearRows, currentGroupRecordIndices);
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
        currentGroupRecordIndices: number[]
    ): void {
        let groupDisplayRowIndex = 0;
        const lastLinearRow = linearRows[linearRows.length - 1];

        currentGroupRecords.forEach((record, i) => {
            if (lastLinearRow?.type === AITableRowType.group && !lastLinearRow.isCollapsed) {
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
        if (currentGroupRecords.length > 0 && lastLinearRow?.type === AITableRowType.group && !lastLinearRow.isCollapsed) {
            let startRecordIndex = 0;
            let endRecordIndex = 0;
            if (currentGroupRecordIndices) {
                // 当前添加按钮对于的记录范围
                startRecordIndex = Math.min(...currentGroupRecordIndices);
                endRecordIndex = Math.max(...currentGroupRecordIndices);
            }

            linearRows.push({
                type: AITableRowType.add,
                _id: nanoid(),
                depth: this.groups.length,
                range: [startRecordIndex, endRecordIndex]
            });
        }
    }

    // 生成分组标签
    private generateGroupTabRows(record: AITableViewRecord, recordIndex: number, totalRecords: number): AITableLinearRowGroup[] {
        const groupTabRows: AITableLinearRowGroup[] = [];

        this.groups.forEach((groupField, depth) => {
            const breakpoints = this.groupBreakpoints.get(groupField.field_id) || [];

            if (breakpoints.includes(recordIndex)) {
                const field = this.fieldsMap[groupField.field_id];
                if (!field) return;

                const breakpointIndex = breakpoints.indexOf(recordIndex);
                const groupId = this.generateGroupId(groupField.field_id, depth, breakpointIndex);
                const isParentCollapsed = this.isParentGroupCollapsed(depth, recordIndex);
                if (!isParentCollapsed) {
                    const groupValue = AITableQueries.getFieldValue(this.aiTable, [record._id, field._id]);
                    const recordRange = this.calculateGroupRecordRange(groupField.field_id, breakpointIndex, totalRecords);

                    groupTabRows.push({
                        type: AITableRowType.group,
                        _id: nanoid(),
                        depth,
                        fieldId: groupField.field_id,
                        groupValue,
                        isCollapsed: this.groupCollapseState.has(groupId),
                        range: recordRange,
                        groupId
                    });
                }
            }
        });

        return groupTabRows;
    }

    private calculateGroupRecordRange(fieldId: string, breakpointIndex: number, totalRecords: number): [number, number] {
        const breakpoints = this.groupBreakpoints.get(fieldId) || [];
        const startIndex = breakpoints[breakpointIndex] || 0;

        let endIndex: number;
        if (breakpointIndex + 1 < breakpoints.length) {
            // 如果不是最后一个分组，结束位置是下一个断点的前一个位置
            endIndex = breakpoints[breakpointIndex + 1] - 1;
        } else {
            // 如果是最后一个分组，结束位置是最后一条记录
            endIndex = totalRecords - 1;
        }

        return [startIndex, endIndex];
    }

    // 生成分组ID
    private generateGroupId(fieldId: string, depth: number, breakpointIndex: number): string {
        // 通过字段ID、深度和断点索引确保唯一
        return `${fieldId}_${depth}_${breakpointIndex}`;
    }

    // 检查所有父级分组是否被折叠
    private isParentGroupCollapsed(currentDepth: number, recordIndex: number): boolean {
        for (let parentDepth = 0; parentDepth < currentDepth; parentDepth++) {
            const parentGroupField = this.groups[parentDepth];
            const parentBreakpoints = this.groupBreakpoints.get(parentGroupField.field_id) || [];

            let parentBreakpointIndex = -1;
            for (let i = parentBreakpoints.length - 1; i >= 0; i--) {
                if (parentBreakpoints[i] <= recordIndex) {
                    parentBreakpointIndex = i;
                    break;
                }
            }

            if (parentBreakpointIndex > -1) {
                const parentGroupId = this.generateGroupId(parentGroupField.field_id, parentDepth, parentBreakpointIndex);
                const isParentCollapsed = this.groupCollapseState.has(parentGroupId);
                if (isParentCollapsed) {
                    return true;
                }
            }
        }

        return false;
    }
}
