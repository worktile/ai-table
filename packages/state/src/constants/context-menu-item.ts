import { AITable, AITableContextMenuItem, AITableActions, isMac, clearSelection } from '@ai-table/grid';
import { Actions } from '../action';
import { AIViewTable } from '../types';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { AITableStateI18nKey, getStateI18nTextByKey } from '../utils/i18n';
import { AddRecordOptions } from '@ai-table/utils';

export const RemoveRecordsItem = (aiTable: AITable, actions: AITableActions): AITableContextMenuItem => {
    return {
        type: 'removeRecords',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.removeRecords),
        icon: 'trash',
        exec: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => {
            let selectedRecordIds = AITable.getActiveRecordIds(aiTable);
            selectedRecordIds.forEach((id: string) => {
                Actions.removeRecord(aiTable as AIViewTable, [id]);
            });
            clearSelection(aiTable);
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
        exec: (aiTable: AITable, targetName: string, position: { x: number; y: number }, notifyService: ThyNotifyService, count: any) => {
            let selectedRecordIds = AITable.getActiveRecordIds(aiTable);
            const aiViewTable = aiTable as AIViewTable;
            const activeView = aiViewTable.viewsMap()[aiViewTable.activeViewId()];
            const addRecordOptions: AddRecordOptions = {
                beforeRecordId: selectedRecordIds[0],
                count
            };
            if (activeView?.settings?.groups?.length) {
                addRecordOptions.forGroupId = selectedRecordIds[0];
            }
            actions.addRecord(addRecordOptions);
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
        exec: (aiTable: AITable, targetName: string, position: { x: number; y: number }, notifyService: ThyNotifyService, count: any) => {
            let selectedRecordIds = AITable.getActiveRecordIds(aiTable);
            const aiViewTable = aiTable as AIViewTable;
            const activeView = aiViewTable.viewsMap()[aiViewTable.activeViewId()];
            const addRecordOptions: AddRecordOptions = {
                afterRecordId: selectedRecordIds[0],
                count
            };
            if (activeView?.settings?.groups?.length) {
                addRecordOptions.forGroupId = selectedRecordIds[0];
            }
            actions.addRecord(addRecordOptions);
        }
    };
};

export const CopyCellsItem = (aiTable: AITable, actions: AITableActions): AITableContextMenuItem => {
    return {
        type: 'copyCells',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.copy),
        shortcutKey: isMac() ? `⌘ + C` : `Ctrl + C`,
        icon: 'copy',
        exec: (aiTable: AITable, targetName: string, position: { x: number; y: number }, notifyService: ThyNotifyService) => {
            document.dispatchEvent(
                new ClipboardEvent('copy', {
                    clipboardData: new DataTransfer(),
                    bubbles: true,
                    cancelable: true,
                    composed: true
                })
            );
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
        exec: async (aiTable: AITable, targetName: string, position: { x: number; y: number }, notifyService: ThyNotifyService) => {
            document.dispatchEvent(
                new ClipboardEvent('paste', {
                    clipboardData: (window as any).dataTransfer,
                    bubbles: true,
                    cancelable: true,
                    composed: true
                })
            );
        }
    };
};
