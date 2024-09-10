import { Injectable, WritableSignal } from '@angular/core';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITableFieldPropertyEditor } from '../components';
import { AITable, AITableField } from '../core';
import { AIFieldConfig } from '../types';

export const AI_TABLE_GRID_FIELD_SERVICE_MAP = new WeakMap<AITable, AITableGridFieldService>();

@Injectable()
export class AITableGridFieldService {
    aiFieldConfig: AIFieldConfig | undefined;

    constructor(private thyPopover: ThyPopover) {}

    initAIFieldConfig(aiFieldConfig: AIFieldConfig | undefined) {
        this.aiFieldConfig = aiFieldConfig;
    }

    editFieldProperty(
        aiTable: AITable,
        aiEditField: WritableSignal<AITableField>,
        isUpdate: boolean,
        origin?: any,
        position?: { x: number; y: number }
    ) {
        const component = this.aiFieldConfig?.fieldPropertyEditor ?? AITableFieldPropertyEditor;
        this.thyPopover.open(component, {
            origin: origin,
            originPosition: position,
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
