import { Signal, WritableSignal } from '@angular/core';
import { Colors } from '../../constants/colors';
import { AITableCellInfo, AITableSelection } from '../../types';
import { RendererContext } from '../context';
import { AITableGridI18nKey } from '../../utils/i18n';
import {
    AITableRecords,
    AITableFields,
    AITableField,
    AITableValue,
    AITableRecord,
    AIRecordFieldIdPath,
    DragType,
    AITableFieldType
} from '@ai-table/utils';
import { AITableDragState } from './core';

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    gridData: Signal<AITableValue>;
    context?: RendererContext;
    selection: WritableSignal<AITableSelection>;
    expendCell: WritableSignal<AITableCellInfo>;
    editingCell: WritableSignal<AITableCellInfo>;
    keywordsMatchedCells: WritableSignal<Set<string>>; // [`${recordId}:${fieldId}`]
    keywordsMatchedCellIndex: WritableSignal<number>;
    keywords: WritableSignal<string | null>;
    recordsMap: Signal<{ [key: string]: AITableRecord }>;
    fieldsMap: Signal<{ [key: string]: AITableField }>;
    recordsWillHidden: WritableSignal<string[]>;
    recordsWillMove: WritableSignal<Map<string, AITableRecord>>;
    dragState?: WritableSignal<AITableDragState>;
    getI18nTextByKey?: (key: AITableGridI18nKey | string) => string;
    getSortKeysMap?: Partial<Record<AITableFieldType, string>>;
}

export type AIPlugin = (aiTable: AITable) => AITable;

export const AITable = {
    getColors() {
        return Colors;
    },
    getVisibleFields(aiTable: AITable): AITableFields {
        return aiTable.gridData().fields.filter((field) => !field.hidden);
    },
    getVisibleRows(aiTable: AITable): AITableRecords {
        return aiTable.records();
    },
    getActiveCell(aiTable: AITable): AIRecordFieldIdPath | null {
        return aiTable.selection().activeCell;
    },
    getActiveRecordIds(aiTable: AITable): string[] {
        const selectedRecords = aiTable.selection().selectedRecords;
        const selectedCells = aiTable.selection().selectedCells;
        let selectedRecordIds: string[] = [];
        if (selectedRecords.size > 0) {
            selectedRecordIds = [...selectedRecords.keys()];
        } else if (selectedCells.size > 0) {
            selectedRecordIds = [...selectedCells].map((item) => item.split(':')[0]);
        } else {
            selectedRecordIds = [];
        }
        return selectedRecordIds;
    },
    isCellVisible(aiTable: AITable, cell: AIRecordFieldIdPath): boolean {
        const visibleRowIndexMap = aiTable.context!.visibleRowsIndexMap();
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        const [recordId, fieldId] = cell || [];
        const isVisible = visibleRowIndexMap!.has(recordId) && visibleColumnIndexMap.has(fieldId);
        return isVisible;
    },
    getCellIndex(aiTable: AITable, cell: AIRecordFieldIdPath): { rowIndex: number; columnIndex: number } | null {
        const visibleRowIndexMap = aiTable.context!.visibleRowsIndexMap();
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        if (AITable.isCellVisible(aiTable, cell)) {
            const [recordId, fieldId] = cell;
            return {
                rowIndex: visibleRowIndexMap!.get(recordId)!,
                columnIndex: visibleColumnIndexMap.get(fieldId)!
            };
        }
        return null;
    },
    isFrozenColumn(aiTable: AITable, columnIndex: number) {
        const frozenColumnCount = aiTable.context!.frozenColumnCount();
        if (columnIndex <= frozenColumnCount - 1) {
            return true;
        }
        return false;
    },
    getDragState(aiTable: AITable): DragType {
        return aiTable.dragState?.()?.type || DragType.none;
    }
};
