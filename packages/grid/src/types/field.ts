import { ElementRef, Signal } from '@angular/core';
import { AITable, AITableField, SelectSettings } from '../core';

export interface AITableFieldMenuItem {
    type: string;
    name?: string;
    icon?: string;
    exec?: (aiTable: AITable, field: Signal<AITableField>, origin?: HTMLElement | ElementRef<any>) => void;
    hidden?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
    disabled?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
}

export interface AITableSelectField extends AITableField {
    settings: SelectSettings;
}
