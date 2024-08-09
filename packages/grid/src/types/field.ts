import { ElementRef, Signal } from '@angular/core';
import { AITable, AITableField, AITableSelectOption } from '../core';

export interface AITableFieldMenuItem {
    type: string;
    name?: string;
    icon?: string;
    exec?: (aiTable: AITable, field: Signal<AITableField>, origin?: HTMLElement | ElementRef<any>) => void;
    hidden?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
    disabled?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
}

export enum AITableSelectOptionStyle {
    text = 1,
    tag = 2,
    dot = 3,
    piece = 4
}

export interface AITableSelectField extends AITableField<AITableSelectOption> {
    options: AITableSelectOption[];
    optionStyle: AITableSelectOptionStyle;
}
