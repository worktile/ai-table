import { ElementRef, WritableSignal } from '@angular/core';
import { AITable, AITableField, AITableFieldType } from '../core';

export interface AITableFieldMenu {
    id: string;
    name: string;
    icon: string;
    exec: (aiTable: AITable, field: AITableField, origin?: HTMLElement | ElementRef<any>) => void;
    hidden?: (aiTable: AITable, type: AITableFieldType) => boolean;
    disabled?: (aiTable: AITable, type: AITableFieldType) => boolean;
    hasDivider?: boolean;
}
