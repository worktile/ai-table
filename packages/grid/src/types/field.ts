import { ElementRef, Signal } from '@angular/core';
import { AITable, AITableField } from '../core';

export interface AITableFieldMenuItem {
    _id: string;
    text?: string;
    icon?: string;
    exec?: (aiTable: AITable, field: Signal<AITableField>, origin?: HTMLElement | ElementRef<any>) => void;
    hidden?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
    disabled?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
}
