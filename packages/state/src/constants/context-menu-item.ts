import {
    AITable,
    AITableContextMenuItem,
    AITableGridI18nKey,
    AITableGridSelectionService,
    AITableActions,
    getI18nTextByKey,
    isMac,
    writeToAITable
} from '@ai-table/grid';
import { Actions } from '../action';
import { AIViewTable } from '../types';
import { buildClipboardData, writeToClipboard } from '@ai-table/grid';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { AITableStateI18nKey, getStateI18nTextByKey } from '../utils/i18n';
export const RemoveRecordsItem = (aiTable: AITable, actions: AITableActions): AITableContextMenuItem => {
    return {
        type: 'removeRecords',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.removeRecords),
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
};

export const InsertUpwardRecords = (aiTable: AITable, actions: AITableActions): AITableContextMenuItem => {
    return {
        type: 'insertUpwardRecords',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.insertUpward),
        nameSuffix: getStateI18nTextByKey(aiTable, AITableStateI18nKey.upward),
        icon: 'table-insert-rows-top',
        isInputNumber: true,
        count: 1,
        exec: (
            aiTable: AITable,
            targetName: string,
            position: { x: number; y: number },
            aiTableGridSelectionService: AITableGridSelectionService,
            notifyService: ThyNotifyService,
            count: any
        ) => {
            let selectedRecordIds = AITable.getActiveRecordIds(aiTable);
            actions.addRecord({
                targetId: selectedRecordIds[0],
                count,
                isInsertBefore: true
            });
        }
    };
};

export const InsertDownwardRecords = (aiTable: AITable, actions: AITableActions): AITableContextMenuItem => {
    return {
        type: 'insertDownwardRecords',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.insertDownward),
        nameSuffix: getStateI18nTextByKey(aiTable, AITableStateI18nKey.downward),
        icon: 'table-insert-rows-down',
        count: 1,
        isInputNumber: true,
        exec: (
            aiTable: AITable,
            targetName: string,
            position: { x: number; y: number },
            aiTableGridSelectionService: AITableGridSelectionService,
            notifyService: ThyNotifyService,
            count: any
        ) => {
            let selectedRecordIds = AITable.getActiveRecordIds(aiTable);
            actions.addRecord({
                targetId: selectedRecordIds[0],
                count
            });
        }
    };
};

export const CopyCellsItem = (aiTable: AITable, actions: AITableActions): AITableContextMenuItem => {
    return {
        type: 'copyCells',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.copy),
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
                    const message = getI18nTextByKey(aiTable, AITableGridI18nKey.copiedCells).replace(
                        '{count}',
                        copiedCellsCount.toString()
                    );
                    notifyService.success(message, undefined, {
                        placement: 'bottomLeft'
                    });
                });
            }
        }
    };
};

export const PasteCellsItem: (aiTable: AITable, actions: AITableActions) => AITableContextMenuItem = (
    aiTable: AITable,
    actions: AITableActions
) => {
    return {
        type: 'pasteCells',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.paste),
        shortcutKey: isMac() ? `⌘ + V` : `Ctrl + V`,
        icon: 'paste',
        exec: async (
            aiTable: AITable,
            targetName: string,
            position: { x: number; y: number },
            aiTableGridSelectionService: AITableGridSelectionService,
            notifyService: ThyNotifyService
        ) => {
            writeToAITable(aiTable, actions).then((result) => {
                if (result.isPasteOverMaxRecords || result.isPasteOverMaxFields) {
                    return;
                }
                if (!result.isPasteSuccess) {
                    notifyService.error(getStateI18nTextByKey(aiTable, AITableStateI18nKey.invalidPasteContent), undefined, {
                        placement: 'bottomLeft'
                    });
                }
            });
        }
    };
};
