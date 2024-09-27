import { ElementRef, signal, Signal, WritableSignal } from '@angular/core';
import _ from 'lodash';
import { Actions, AITable, AITableField } from '../core';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP } from '../services/field.service';
import { AITableFieldMenuItem } from '../types';

export const DividerMenuItem = {
    type: 'divider'
};

export const EditFieldPropertyItem = {
    type: 'editFieldProperty',
    name: '编辑列',
    icon: 'edit',
    exec: (aiTable: AITable, field: Signal<AITableField>, origin?: HTMLElement | ElementRef<any>, position?: { x: number; y: number }) => {
        const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);
        const copyField: AITableField = _.cloneDeep(field());
        if (origin && position) {
            fieldService?.editFieldProperty(aiTable, {
                field: copyField,
                isUpdate: true,
                origin,
                position
            });
        }
    }
};

export const RemoveFieldItem = {
    type: 'removeField',
    name: '删除列',
    icon: 'trash',
    exec: (aiTable: AITable, field: Signal<AITableField>) => {
        Actions.removeField(aiTable, [field()._id]);
    }
};

export const DefaultFieldMenus: AITableFieldMenuItem[] = [EditFieldPropertyItem, RemoveFieldItem];
