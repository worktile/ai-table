import { AddFieldOptions, AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableField, AITableFieldSetting, idCreator } from '@ai-table/grid';
import { ElementRef, Signal } from '@angular/core';
import _ from 'lodash';
import { Actions } from '../action';
import { AIViewTable } from '../types';

export const DividerMenuItem = {
    type: 'divider'
};

export const EditFieldPropertyItem = {
    type: 'editFieldProperty',
    name: '编辑列',
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
};

export const CopyFieldPropertyItem = (addFieldFn: (data: AddFieldOptions) => void) => {
    return {
        type: 'copyFieldProperty',
        name: '复制列',
        icon: 'copy',
        exec: (aiTable: AIViewTable, field: Signal<AITableField>) => {
            const allFieldNames = (aiTable.fields() || []).map((item) => item.name);
            let newFieldName = `${field().name} 副本`;
            let index = 2;
            while (allFieldNames.includes(newFieldName)) {
                newFieldName = `${field().name} 副本 ${index}`;
                index++;
            }

            const fieldOptions: AddFieldOptions = {
                originId: field()._id,
                isCopy: true,
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
