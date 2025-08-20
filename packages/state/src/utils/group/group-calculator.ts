import { AITable, AITableQueries, FieldModelMap } from '@ai-table/grid';
import { AITableGroupInfo, AITableViewRecords, AITableViewFields, AITableViewField, AITableViewRecord, Id } from '@ai-table/utils';
import { AITableLinearRow, AITableLinearRowGroupTab, AITableLinearRowBlank, AITableLinearRowRecord, AITableRowType } from '@ai-table/grid';
import { nanoid } from 'nanoid';

export class GroupCalculator {
    private groupInfo: AITableGroupInfo;
    private groupBreakpoints: Map<string, number[]>;
    private groupCollapseState: Set<string>;
    private aiTable: AITable;

    constructor(groupInfo: AITableGroupInfo, aiTable: AITable, collapseState?: string[]) {
        this.groupInfo = groupInfo;
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
                this.groupInfo.reduce((result, groupField) => {
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

    private detectGroupBreakpoints(records: AITableViewRecords, fields: AITableViewFields): void {
        this.groupBreakpoints.clear();

        if (records.length === 0) return;

        const fieldsMap = new Map(fields.map((field) => [field._id, field]));
        let previousRecord: AITableViewRecord | null = null;

        records.forEach((record, index) => {
            if (previousRecord === null) {
                // 第一条记录，所有分组字段都是断点
                this.groupInfo.forEach((groupField, groupIndex) => {
                    this.addBreakpoint(groupField.fieldId, index, groupIndex);
                });
            } else {
                // 检查每个分组字段是否发生变化
                this.groupInfo.forEach((groupField, groupIndex) => {
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
                        for (let i = groupIndex; i < this.groupInfo.length; i++) {
                            this.addBreakpoint(this.groupInfo[i].fieldId, index, i);
                        }
                        return;
                    }
                });
            }

            previousRecord = record;
        });
    }

    private addBreakpoint(fieldId: string, recordIndex: number, depth: number): void {
        if (!this.groupBreakpoints.has(fieldId)) {
            this.groupBreakpoints.set(fieldId, []);
        }
        this.groupBreakpoints.get(fieldId)!.push(recordIndex);
    }

    private generateLinearRows(records: AITableViewRecords, fields: AITableViewFields): AITableLinearRow[] {
        const linearRows: AITableLinearRow[] = [];
        const fieldsMap = new Map(fields.map((field) => [field._id, field]));
        let displayRowIndex = 0;

        // 添加空白行开始
        linearRows.push({
            type: AITableRowType.blank,
            _id: nanoid(), // 生成id
            depth: 0
        } as AITableLinearRowBlank);

        records.forEach((record, index) => {
            // 生成分组标签行
            const groupTabRows = this.generateGroupTabRows(record, index, fieldsMap);
            linearRows.push(...groupTabRows);

            // 当前记录是否应该显示
            if (this.shouldShowRecord(record, index)) {
                displayRowIndex++;
                linearRows.push({
                    type: AITableRowType.record,
                    _id: record._id,
                    displayIndex: displayRowIndex,
                    depth: this.groupInfo.length
                } as AITableLinearRowRecord);
            }
        });

        // 添加新增行
        if (this.shouldShowAddRow()) {
            linearRows.push({
                type: AITableRowType.add,
                _id: ''
            });
        }

        return linearRows;
    }

    private generateGroupTabRows(
        record: AITableViewRecord,
        recordIndex: number,
        fieldsMap: Map<string, AITableViewField>
    ): AITableLinearRowGroupTab[] {
        const groupTabRows: AITableLinearRowGroupTab[] = [];

        this.groupInfo.forEach((groupField, depth) => {
            const breakpoints = this.groupBreakpoints.get(groupField.fieldId) || [];

            if (breakpoints.includes(recordIndex)) {
                const field = fieldsMap.get(groupField.fieldId);
                if (!field) return;

                const groupValue = AITableQueries.getFieldValue(this.aiTable, [record._id, field._id]);
                const groupId = this.generateGroupId(groupField.fieldId, groupValue, depth);
                const recordCount = this.calculateGroupRecordCount(record, recordIndex, depth);

                groupTabRows.push({
                    type: AITableRowType.groupTab,
                    _id: nanoid(), // 生成id
                    depth,
                    fieldId: groupField.fieldId,
                    groupValue,
                    isCollapsed: false,
                    recordCount,
                    groupId
                } as AITableLinearRowGroupTab);
            }
        });

        return groupTabRows;
    }

    private generateGroupId(fieldId: string, groupValue: any, depth: number): string {
        // TODO: 实现分组id
        return '';
    }

    private calculateGroupRecordCount(record: AITableViewRecord, recordIndex: number, depth: number): number {
        // TODO: 实现分组记录数
        return 1;
    }

    private shouldShowRecord(record: AITableViewRecord, recordIndex: number): boolean {
        // TODO: 实现折叠状态
        return true;
    }

    private shouldShowAddRow(): boolean {
        // TODO: 实现添加行显示
        // 只有在最后一个分组展开时才显示添加行
        return true;
    }

    toggleGroupCollapse(groupId: string): void {
        if (this.groupCollapseState.has(groupId)) {
            this.groupCollapseState.delete(groupId);
        } else {
            this.groupCollapseState.add(groupId);
        }
    }
}
