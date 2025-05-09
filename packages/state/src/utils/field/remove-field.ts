import { AITable } from '@ai-table/grid';
import { Signal } from '@angular/core';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';
import { AITableStateI18nKey, getStateI18nTextByKey } from '../../utils/i18n';
import { AITableRecordUpdatedInfo, AITableField } from '@ai-table/utils';

export const buildRemoveFieldItem = (aiTable: AITable, getUpdatedInfo: () => AITableRecordUpdatedInfo) => {
    return {
        type: 'removeField',
        name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.removeField),
        icon: 'trash',
        exec: (aiTable: AITable, field: Signal<AITableField>) => {
            Actions.removeField(aiTable as AIViewTable, [field()._id]);
        }
    };
};
