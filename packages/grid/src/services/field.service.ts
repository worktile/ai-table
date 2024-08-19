import { ElementRef, Injectable, ModelSignal, WritableSignal } from '@angular/core';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITable, AITableField, AITableFields } from '../core';
import { AITableFieldPropertyEditor } from '../components';
import { AIFieldConfig } from '../types';

export const AI_TABLE_GRID_FIELD_SERVICE_MAP = new WeakMap<AITable, AITableGridFieldService>();

@Injectable()
export class AITableGridFieldService {
    aiFieldConfig: AIFieldConfig | undefined;

    constructor(private thyPopover: ThyPopover) {}

    initAIFieldConfig(aiFieldConfig: AIFieldConfig | undefined) {
        this.aiFieldConfig = aiFieldConfig;
    }

    editFieldProperty(origin: HTMLElement | ElementRef<any>, aiTable: AITable, aiEditField: WritableSignal<AITableField>, isUpdate: boolean) {
        const component = this.aiFieldConfig?.fieldPropertyEditor ?? AITableFieldPropertyEditor;
        this.thyPopover.open(component, {
            origin: origin,
            manualClosure: true,
            placement: 'bottomLeft',
            initialState: {
                aiTable,
                aiEditField,
                isUpdate
            }
        });
    }
}
