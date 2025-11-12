import { Injectable } from '@angular/core';
import { AITable, AITableQueries } from '../core';

/**
 * 单元格位置
 */
export interface CellPosition {
    recordId: string;
    fieldId: string;
}

/**
 * 记录位置信息
 */
export interface RecordPosition {
    index: number;
    total: number;
    hasPrevious: boolean;
    hasNext: boolean;
    previousId: string | null;
    nextId: string | null;
}

/**
 * 表格控制服务
 */
@Injectable()
export class GridControlService {
    private aiTable!: AITable;

    /**
     * 初始化服务
     */
    init(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    /**
     * 设置活跃单元格
     */
    setActiveCell(recordId: string, fieldId: string, options?: { scroll?: boolean }): void {
        this.aiTable.selection.set({
            ...this.aiTable.selection(),
            activeCell: [recordId, fieldId]
        });

        if (options?.scroll) {
            this.scrollToCell(recordId, fieldId);
        }
    }

    getActiveCell() {
        return this.aiTable.selection().activeCell;
    }

    /**
     * 清除活跃单元格
     */
    clearActiveCell(): void {
        this.aiTable.selection.set({
            ...this.aiTable.selection(),
            activeCell: null
        });
    }

    /**
     * 设置活跃记录
     */
    setActiveRecord(recordId: string, options?: { scroll?: boolean }): void {
        this.aiTable.selection.set({
            ...this.aiTable.selection(),
            selectedRecords: new Set([recordId])
        });

        if (options?.scroll) {
            this.scrollToRecord(recordId);
        }
    }

    /**
     * 切换到下一条记录
     */
    nextRecord(): string | null {
        const records = this.aiTable.gridData().records;
        const visibleRowsIndexMap = this.aiTable.context!.visibleRowsIndexMap()!;
        const currentId = this.getActiveCell()?.[0];

        if (!currentId) return null;

        const currentIndex = visibleRowsIndexMap.get(currentId) || 0;
        if (currentIndex === -1 || currentIndex === records.length - 1) {
            return null;
        }

        const nextId = records[currentIndex + 1]._id;
        this.setActiveRecord(nextId, { scroll: true });
        return nextId;
    }

    /**
     * 切换到上一条记录
     */
    previousRecord(): string | null {
        const records = this.aiTable.gridData().records;
        const visibleRowsIndexMap = this.aiTable.context!.visibleRowsIndexMap()!;
        const currentId = this.getActiveCell()?.[0];

        if (!currentId) return null;

        const currentIndex = visibleRowsIndexMap.get(currentId) || 0;
        if (currentIndex <= 0) {
            return null;
        }

        const prevId = records[currentIndex - 1]._id;
        this.setActiveRecord(prevId, { scroll: true });
        return prevId;
    }

    /**
     * 获取记录位置信息
     */
    getRecordPosition(recordId: string): RecordPosition | null {
        const records = this.aiTable.gridData().records;
        const visibleRowsIndexMap = this.aiTable.context!.visibleRowsIndexMap()!;
        const index = visibleRowsIndexMap.get(recordId) || 0;

        if (index === -1) return null;

        return {
            index,
            total: records.length,
            hasPrevious: index > 0,
            hasNext: index < records.length - 1,
            previousId: index > 0 ? records[index - 1]._id : null,
            nextId: index < records.length - 1 ? records[index + 1]._id : null
        };
    }

    /**
     * 滚动到指定单元格
     */
    scrollToCell(recordId: string, fieldId: string): void {
        // TODO:
    }

    /**
     * 滚动到指定记录
     */
    scrollToRecord(recordId: string): void {
        if (!this.aiTable) return;

        const firstField = this.aiTable.gridData().fields[0];
        if (firstField) {
            this.scrollToCell(recordId, firstField._id);
        }
    }

    /**
     * 获取单元格值
     */
    getCellValue(recordId: string, fieldId: string): any {
        if (!this.aiTable) return null;
        return AITableQueries.getFieldValue(this.aiTable, [recordId, fieldId]);
    }

    /**
     * 获取记录数据
     */
    getRecord(recordId: string): any {
        if (!this.aiTable) return null;
        return this.aiTable.recordsMap()[recordId];
    }

    /**
     * 获取字段
     */
    getField(fieldId: string): any {
        if (!this.aiTable) return null;
        return this.aiTable.fieldsMap()[fieldId];
    }

    /**
     * 获取所有可见字段
     */
    getVisibleFields(): any[] {
        if (!this.aiTable) return [];
        return this.aiTable.gridData().fields;
    }

    /**
     * 获取首列字段
     */
    getFirstField(): any {
        if (!this.aiTable) return null;
        return this.aiTable.gridData().fields[0] || null;
    }
}
