import { AITable, AITableField } from '../core';
import { AITableFieldMenu } from '../types/field';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP } from '../services/field.service';
import { ElementRef, signal, Signal, WritableSignal } from '@angular/core';

export const DividerMenuItem = {
    id: 'divider'
};

export const EditFieldPropertyItem = {
    id: 'editFieldProperty',
    name: '编辑列',
    icon: 'edit',
    exec: (aiTable: AITable, field: Signal<AITableField>, origin?: HTMLElement | ElementRef<any>) => {
        const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);
        const copyField: WritableSignal<AITableField> = signal(JSON.parse(JSON.stringify(field())));
        origin && fieldService?.editFieldProperty(origin, aiTable, copyField, true);
    }
};

export const DefaultFieldMenus: AITableFieldMenu[] = [EditFieldPropertyItem];
