import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoShape } from '../../../angular-konva/components/shape.component';
import {
    AI_TABLE_CELL,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_BLANK_HEIGHT,
    CheckboxCheckedSvgString,
    Colors
} from '../../../constants';
import { generateTargetName } from '../../../utils';
import { AITableFieldType, isEmpty } from '@ai-table/utils';
import { CoverCellBase } from './cover-cell-base';
import { KoContainer } from '../../../angular-konva';

@Component({
    selector: 'ai-table-checkbox',
    template: `
        <ko-group>
            @if (isChecked()) {
                <ko-image [config]="checkbox()" (koClick)="setChecked(false)"></ko-image>
            } @else {
                <ko-rect [config]="emptyCheckbox()" (koClick)="setChecked(true)"></ko-rect>
            }
        </ko-group>
    `,
    imports: [KoShape, KoContainer],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellCheckbox extends CoverCellBase {
    static override fieldType = AITableFieldType.checkbox;

    isChecked = computed(() => {
        const { render } = this.config()!;
        const { transformValue } = render;
        return !isEmpty(transformValue) && !!transformValue;
    });

    checkbox = computed<any>(() => {
        const { render, field, recordId, readonly } = this.config()!;

        if (render) {
            const { columnWidth } = render;
            const currentX = AI_TABLE_OFFSET + (columnWidth - AI_TABLE_ICON_COMMON_SIZE) / 2;
            let currentY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_ICON_COMMON_SIZE) / 2 + AI_TABLE_OFFSET;
            const image = new Image();
            image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(CheckboxCheckedSvgString)}`;
            return {
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId,
                    mouseStyle: readonly ? 'default' : 'pointer'
                }),
                x: currentX,
                y: currentY,
                width: AI_TABLE_ICON_COMMON_SIZE,
                height: AI_TABLE_ICON_COMMON_SIZE,
                image,
                listening: true
            };
        }

        return null;
    });

    emptyCheckbox = computed<any>(() => {
        const { render, field, recordId, readonly } = this.config()!;

        if (render) {
            const { columnWidth } = render;
            const currentX = AI_TABLE_OFFSET + (columnWidth - AI_TABLE_ICON_COMMON_SIZE) / 2;
            let currentY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_ICON_COMMON_SIZE) / 2 + AI_TABLE_OFFSET;

            return {
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId,
                    mouseStyle: readonly ? 'default' : 'pointer'
                }),
                x: currentX,
                y: currentY,
                width: AI_TABLE_ICON_COMMON_SIZE,
                height: AI_TABLE_ICON_COMMON_SIZE,
                stroke: Colors.gray300,
                strokeWidth: 1,
                cornerRadius: 2,
                listening: true
            };
        }

        return null;
    });

    setChecked(isChecked: boolean) {
        const { actions } = this.config()!;
        actions.updateFieldValues([
            {
                value: isChecked,
                path: [this.config()!.recordId!, this.config()!.field._id]
            }
        ]);
    }
}
