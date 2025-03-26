import { AITable, AITableContextMenuItem, AITableGridSelectionService, AITablePasteActions, isMac, writeToAITable } from '@ai-table/grid';
import { Actions } from '../action';
import { AIViewTable } from '../types';
import { buildClipboardData, writeToClipboard } from '@ai-table/grid';

export const RemoveRecordsItem: AITableContextMenuItem = {
    type: 'removeRecords',
    name: '删除行',
    icon: 'trash',
    exec: (
        aiTable: AITable,
        targetName: string,
        position: { x: number; y: number },
        aiTableGridSelectionService: AITableGridSelectionService
    ) => {
        let selectedRecordIds = AITable.getActiveRecordIds(aiTable);

        selectedRecordIds.forEach((id: string) => {
            Actions.removeRecord(aiTable as AIViewTable, [id]);
        });

        aiTableGridSelectionService.clearSelection();
    }
};

export const CopyCellsItem: AITableContextMenuItem = {
    type: 'copyCells',
    name: '复制',
    shortcutKey: isMac() ? `⌘ + C` : `Ctrl + C`,
    icon: 'copy',
    exec: (aiTable: AITable) => {
        const clipboardData = buildClipboardData(aiTable);
        if (clipboardData) {
            writeToClipboard(clipboardData);
        }
    }
};

export const PasteCellsItem: (actions: AITablePasteActions) => AITableContextMenuItem = (actions: AITablePasteActions) => {
    return {
        type: 'pasteCells',
        name: '粘贴',
        shortcutKey: isMac() ? `⌘ + V` : `Ctrl + V`,
        icon: 'paste',
        exec: async (
            aiTable: AITable,
            targetName: string,
            position: { x: number; y: number },
            aiTableGridSelectionService: AITableGridSelectionService
        ) => {
            writeToAITable(aiTable, actions);
        }
    };
};
