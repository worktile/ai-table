import { ElementRef, Signal, WritableSignal } from '@angular/core';
import { AITable, AITableField } from '../core';

export interface AITableFieldMenu {
    id: string;
    name?: string;
    icon?: string;
    exec?: (aiTable: AITable, field: Signal<AITableField>, origin?: HTMLElement | ElementRef<any>) => void;
    hidden?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
    disabled?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
}
