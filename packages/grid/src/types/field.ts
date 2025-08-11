import { ElementRef, Signal } from '@angular/core';
import { AITable } from '../core';
import { AITableField, AITableReferences, SelectSettings } from '@ai-table/utils';
import { Constructor } from 'ngx-tethys/core';

export interface AITableFieldMenuItem {
    type: string;
    name?: string | ((field: AITableField) => string);
    icon?: string;
    customComponent?: (aiTable: AITable, field: AITableField) => Constructor<any>;
    exec?: (
        aiTable: AITable,
        field: Signal<AITableField>,
        origin?: HTMLElement | ElementRef<any>,
        position?: { x: number; y: number }
    ) => any;
    hidden?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
    disabled?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
}

export interface AITableSelectField extends AITableField {
    settings: SelectSettings;
}

export interface AITableEditFieldOptions {
    field: AITableField;
    references: AITableReferences;
    isUpdate: boolean;
    origin: HTMLElement | ElementRef<any>;
    position?: { x: number; y: number };
}

export interface AITableFieldMenuOptions {
    fieldId: string;
    fieldMenus: AITableFieldMenuItem[];
    editOrigin?: any;
    origin?: any;
    position?: { x: number; y: number };
    editFieldPosition?: { x: number; y: number };
}
