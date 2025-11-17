import { AITable, AITableCommonTriggerSource, getColumnIndicesSizeMap } from '@ai-table/grid';
import { Signal } from '@angular/core';
import { AIViewTable } from '../../types';
import { AITableStateI18nKey, getStateI18nTextByKey } from '../../utils/i18n';
import { AITableField, AITableSizeMap, AI_TABLE_DEFAULT_MIN_UNFROZEN_WIDTH, AI_TABLE_MIN_FROZEN_COLUMN_COUNT } from '@ai-table/utils';
import { ViewActions } from '../../action/view';

export function getFrozenFieldId(aiTable: AITable): string | undefined {
    try {
        const viewTable = aiTable as AIViewTable;
        const activeViewId = viewTable.activeViewId();
        const activeView = viewTable.viewsMap()[activeViewId];
        return activeView?.settings?.frozen_field_id;
    } catch (error) {
        return undefined;
    }
}

function calculateAdaptiveFrozenColumnCountCore(config: {
    containerWidth: number;
    rowHeadWidth: number;
    visibleFields: AITableField[];
    columnIndicesSizeMap: AITableSizeMap;
    frozenFieldId?: string;
    minUnfrozenWidth?: number;
}): number {
    const {
        containerWidth,
        rowHeadWidth,
        visibleFields,
        columnIndicesSizeMap,
        frozenFieldId,
        minUnfrozenWidth = AI_TABLE_DEFAULT_MIN_UNFROZEN_WIDTH
    } = config;

    if (visibleFields.length === 0) {
        return AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
    }

    let targetFrozenCount: number;

    if (frozenFieldId) {
        const frozenFieldIndex = visibleFields.findIndex((field) => field._id === frozenFieldId);
        if (frozenFieldIndex >= 0) {
            targetFrozenCount = frozenFieldIndex + 1;
        } else {
            targetFrozenCount = AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
        }
    } else {
        targetFrozenCount = AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
    }

    const availableWidth = containerWidth - rowHeadWidth;

    const maxFrozenWidth = Math.max(0, availableWidth - minUnfrozenWidth);

    let currentFrozenWidth = 0;
    let actualFrozenCount = 0;
    const maxPossibleCount = Math.min(targetFrozenCount, visibleFields.length);

    for (let i = 0; i < maxPossibleCount; i++) {
        const fieldWidth = columnIndicesSizeMap[i];
        const newFrozenWidth = currentFrozenWidth + fieldWidth;

        if (newFrozenWidth > maxFrozenWidth) {
            if (i === 0) {
                currentFrozenWidth = newFrozenWidth;
                actualFrozenCount = AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
            }
            break;
        }

        currentFrozenWidth = newFrozenWidth;
        actualFrozenCount = i + 1;
    }

    // 至少有一列冻结
    if (actualFrozenCount < AI_TABLE_MIN_FROZEN_COLUMN_COUNT) {
        actualFrozenCount = AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
        if (visibleFields.length > 0) {
            currentFrozenWidth = columnIndicesSizeMap[0];
        }
    }

    return actualFrozenCount;
}

export function calculateAdaptiveFrozenColumnCount(aiTable: AITable, containerWidth: number, minUnfrozenWidth: number = 200): number {
    try {
        if (containerWidth <= 0) {
            return AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
        }

        const frozenFieldId = getFrozenFieldId(aiTable);

        const visibleFields = AITable.getVisibleFields(aiTable);
        const columnIndicesSizeMap = getColumnIndicesSizeMap(aiTable, visibleFields);
        const rowHeadWidth = aiTable.context?.rowHeadWidth?.() || 0;
        return calculateAdaptiveFrozenColumnCountCore({
            containerWidth,
            rowHeadWidth,
            visibleFields,
            columnIndicesSizeMap,
            frozenFieldId,
            minUnfrozenWidth
        });
    } catch (error) {
        return AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
    }
}

export const freezeToThisColumn = (aiTable: AITable, source?: AITableCommonTriggerSource) => {
    return {
        type: 'freezeToThisColumn',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.freezeToThisColumn),
        icon: 'frozen',
        exec: (aiTable: AITable, field: Signal<AITableField>) => {
            const currentField = field();
            const viewTable = aiTable as AIViewTable;
            ViewActions.setView(
                viewTable,
                {
                    settings: { ...viewTable.viewsMap()[viewTable.activeViewId()].settings, frozen_field_id: currentField._id }
                },
                [viewTable.activeViewId()]
            );
        },
        hidden: (aiTable: AITable, field: Signal<AITableField>) => {
            if (aiTable.context?.readonly?.() || source === 'record-detail') {
                return true;
            }

            const currentField = field();
            const currentFrozenFieldId = getFrozenFieldId(aiTable);

            return currentFrozenFieldId === currentField._id;
        },
        disabled: (aiTable: AITable, field: Signal<AITableField>) => {
            try {
                const currentField = field();
                const fields = aiTable.gridData().fields;
                const currentFieldIndex = fields.findIndex((f) => f._id === currentField._id);

                const visibleFields = AITable.getVisibleFields(aiTable);
                const columnIndicesSizeMap = getColumnIndicesSizeMap(aiTable, visibleFields);
                const containerWidth = aiTable.context?.containerRect()?.width || 0;
                const rowHeadWidth = aiTable.context?.rowHeadWidth?.() || 0;
                const actualFrozenCount = calculateAdaptiveFrozenColumnCountCore({
                    containerWidth,
                    rowHeadWidth,
                    visibleFields,
                    columnIndicesSizeMap,
                    frozenFieldId: currentField._id,
                    minUnfrozenWidth: AI_TABLE_DEFAULT_MIN_UNFROZEN_WIDTH
                });

                if (actualFrozenCount < currentFieldIndex + 1) {
                    // 超过可视区域禁用
                    return true;
                }

                const currentFrozenFieldId = getFrozenFieldId(aiTable);

                if (!currentFrozenFieldId && currentFieldIndex === 0) {
                    // 默认第一列冻结列禁用
                    return true;
                }
                return false;
            } catch (error) {
                return false;
            }
        }
    };
};

export const restoreDefaultFrozenColumn = (aiTable: AITable, source?: AITableCommonTriggerSource) => {
    return {
        type: 'restoreDefaultFrozenColumn',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.restoreDefaultFrozenColumn),
        icon: 'frozen',
        exec: (aiTable: AITable, field: Signal<AITableField>) => {
            const viewTable = aiTable as AIViewTable;
            ViewActions.setView(
                viewTable,
                {
                    settings: { ...viewTable.viewsMap()[viewTable.activeViewId()].settings, frozen_field_id: undefined }
                },
                [viewTable.activeViewId()]
            );
        },
        hidden: (aiTable: AITable, field: Signal<AITableField>) => {
            if (aiTable.context?.readonly?.() || source === 'record-detail') {
                return true;
            }

            const currentField = field();
            const currentFrozenFieldId = getFrozenFieldId(aiTable);

            if (!currentFrozenFieldId) {
                return true;
            }

            return currentField._id !== currentFrozenFieldId;
        }
    };
};
