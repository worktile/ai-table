import { Actions, AIFieldPath, AITable, AITableField, AITableQueries } from '../core';
import { AITableFieldMenu } from '../types/field';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP } from '../services/field.service';
import { ElementRef, Signal, WritableSignal } from '@angular/core';

export const DividerMenuItem = {
    id: 'divider'
};

export const EditFieldPropertyItem = {
    id: 'editFieldProperty',
    name: '编辑列',
    icon: 'edit',
    exec: (aiTable: AITable, field: WritableSignal<AITableField>, origin?: HTMLElement | ElementRef<any>) => {
        const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);
        origin && fieldService?.editFieldProperty(origin, aiTable, field, true);
    }
};

export const RemoveFieldItem = {
    id: 'removeField',
    name: '删除列',
    icon: 'trash',
    exec: (aiTable: AITable, field: Signal<AITableField>) => {
        const path = AITableQueries.findPath(aiTable, field()) as AIFieldPath;
        Actions.removeField(aiTable, path);
    }
};

export const DefaultFieldMenus: AITableFieldMenu[] = [EditFieldPropertyItem, RemoveFieldItem];
