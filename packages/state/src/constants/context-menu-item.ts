import { AITable, AITableContextMenuItem, AITableGridSelectionService, AITablePasteActions, isMac, writeToAITable } from '@ai-table/grid';
import { Actions } from '../action';
import { AIViewTable } from '../types';
import { buildClipboardData, writeToClipboard } from '@ai-table/grid';
import { ThyNotifyService } from 'ngx-tethys/notify';

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
    exec: (
        aiTable: AITable,
        targetName: string,
        position: { x: number; y: number },
        aiTableGridSelectionService: AITableGridSelectionService,
        notifyService: ThyNotifyService
    ) => {
        const clipboardData = buildClipboardData(aiTable);
        if (clipboardData) {
            writeToClipboard(clipboardData).then(() => {
                const copiedCellsCount = aiTable.selection().selectedCells.size;
                notifyService.success(`已复制 ${copiedCellsCount} 个单元格`, undefined, {
                    placement: 'bottomLeft'
                });
            });
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
            aiTableGridSelectionService: AITableGridSelectionService,
            notifyService: ThyNotifyService
        ) => {
            writeToAITable(aiTable, actions).then((isPasteSuccess) => {
                if (!isPasteSuccess) {
                    notifyService.error('粘贴内容不符合当前类型', undefined, {
                        placement: 'bottomLeft'
                    });
                }
            });
        }
    };
};
