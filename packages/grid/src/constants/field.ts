import { AITable, AITableField, AITableFieldType } from '../core';
import { AITableFieldMenu } from '../types/field';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP } from '../services/field.service';
import { ElementRef } from '@angular/core';

export const editFieldProperty = {
    id: 'editFieldProperty',
    name: '编辑列',
    icon: 'edit',
    exec: (aiTable: AITable, field: AITableField, origin?: HTMLElement | ElementRef<any>) => {
        const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);
        origin && fieldService?.editFieldProperty(origin, aiTable, field);
    },
    hidden: (aiTable: AITable, type: AITableFieldType) => false,
    disabled: (aiTable: AITable, type: AITableFieldType) => false
};
export const duplicateField = {
    id: 'duplicateField',
    name: '复制列',
    icon: 'copy',
    exec: (aiTable: AITable, field: AITableField) => {},
    hidden: (aiTable: AITable, type: AITableFieldType) => false,
    disabled: (aiTable: AITable, type: AITableFieldType) => false,
    hasDivider: true
};

export const insertBefore = {
    id: 'insertBefore',
    name: '向左插入列',
    icon: 'arrow-left',
    exec: (aiTable: AITable, field: AITableField) => {},
    hidden: (aiTable: AITable, type: AITableFieldType) => false,
    disabled: (aiTable: AITable, type: AITableFieldType) => false
};

export const insertAfter = {
    id: 'insertAfter',
    name: '向右插入列',
    icon: 'arrow-right',
    exec: (aiTable: AITable, field: AITableField) => {},
    hidden: (aiTable: AITable, type: AITableFieldType) => false,
    disabled: (aiTable: AITable, type: AITableFieldType) => false,
    hasDivider: true
};

export const deleteField = {
    id: 'insertAfter',
    name: '删除列',
    icon: 'trash',
    exec: (aiTable: AITable, field: AITableField) => {},
    hidden: (aiTable: AITable, type: AITableFieldType) => false,
    disabled: (aiTable: AITable, type: AITableFieldType) => false,
    hasDivider: true
};

export const DefaultFieldMenus: AITableFieldMenu[] = [editFieldProperty, duplicateField, insertBefore, insertAfter, deleteField];
