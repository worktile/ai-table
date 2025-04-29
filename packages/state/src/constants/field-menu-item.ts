import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITable, AITableFieldSetting, idCreator } from '@ai-table/grid';
import { ElementRef, Signal } from '@angular/core';
import _ from 'lodash';
import { Actions } from '../action';
import { AIViewTable } from '../types';
import { generateCopyName } from '../utils';
import { AITableStateI18nKey, getStateI18nTextByKey } from '../utils/i18n';
import { AddFieldOptions, AITableField } from '@ai-table/utils';

export const DividerMenuItem = {
    type: 'divider'
};

export const EditFieldPropertyItem = (aiTable: AITable) => ({
    type: 'editFieldProperty',
    name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.editField),
    icon: 'edit',
    exec: (
        aiTable: AIViewTable,
        field: Signal<AITableField>,
        origin?: HTMLElement | ElementRef<any>,
        position?: { x: number; y: number }
    ) => {
        const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);
        const copyField: AITableField = _.cloneDeep(field());
        if (origin && position) {
            const popoverRef = fieldService?.editFieldProperty(aiTable, {
                field: copyField,
                isUpdate: true,
                origin: origin!,
                position
            });
            if (popoverRef && fieldService && !fieldService.aiFieldConfig?.fieldSettingComponent) {
                (popoverRef.componentInstance as AITableFieldSetting).setField.subscribe((value) => {
                    Actions.setField(aiTable, value.field, value.path);
                });
            }
            return popoverRef;
        }
        return undefined;
    }
});

export const CopyFieldPropertyItem = (aiTable: AITable, addFieldFn: (data: AddFieldOptions) => void) => {
    const name = getStateI18nTextByKey(aiTable, AITableStateI18nKey.copyField);
    return {
        type: 'copyFieldProperty',
        name,
        icon: 'copy',
        exec: (aiTable: AIViewTable, field: Signal<AITableField>) => {
            const allFieldNames = (aiTable.fields() || []).map((item) => item.name);
            const copyName = field().name;
            let newFieldName = generateCopyName(aiTable, allFieldNames, copyName);

            const fieldOptions: AddFieldOptions = {
                originId: field()._id,
                isDuplicate: true,
                defaultValue: {
                    ...field(),
                    _id: idCreator(),
                    name: newFieldName
                }
            };
            addFieldFn(fieldOptions);
        }
    };
};
