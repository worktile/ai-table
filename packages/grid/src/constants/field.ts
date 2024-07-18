import { AITable, AITableField } from '../core';
import { AITableFieldMenu } from '../types/field';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP } from '../services/field.service';
import { ElementRef, WritableSignal } from '@angular/core';

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

export const DefaultFieldMenus: AITableFieldMenu[] = [EditFieldPropertyItem];
