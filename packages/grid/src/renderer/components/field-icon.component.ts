import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AITableFieldTypeIconConfig } from '../../types';
import { AITableIcon } from './icon.component';
import { getFieldIconPath } from '../../utils/field';

@Component({
    selector: 'ai-table-field-icon',
    template: ` <ai-table-icon [config]="iconConfig()"></ai-table-icon> `,
    imports: [AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldIcon {
    config = input.required<AITableFieldTypeIconConfig>();

    iconConfig = computed(() => {
        const { field, x, y, width, height, fill, path } = this.config();
        const data = getFieldIconPath(field) || path;
        return {
            x,
            y,
            size: width,
            backgroundHeight: height,
            listening: false,
            data,
            fill
        };
    });
}
