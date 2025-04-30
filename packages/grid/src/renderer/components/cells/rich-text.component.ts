import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL,
    AI_TABLE_CELL_EDIT,
    AI_TABLE_CELL_PADDING,
    Colors,
    EditPath
} from '../../../constants';
import { generateTargetName } from '../../../utils';
import { AITableActionIconConfig, AITableHoverCellConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';
import { HoverCellComponent } from '../../interfaces';
import { AITableActionIcon } from '../action-icon.component';
import { TextConfig } from 'konva/lib/shapes/Text';
import { drawer } from '../../drawers/drawer';
import { AITableText } from '../text.component';
import { isNil } from 'lodash';

@Component({
    selector: 'ai-table-rich-text',
    template: `
        @if (textConfig()) {
            <ai-table-text [config]="textConfig()!"></ai-table-text>
        }
        <ai-table-action-icon [config]="iconConfig()"></ai-table-action-icon>
    `,
    standalone: true,
    imports: [AITableText, AITableActionIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellRichText implements HoverCellComponent {
    static fieldType = AITableFieldType.richText;

    config = input<AITableHoverCellConfig>();

    textConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, y, transformValue, field, columnWidth, rowHeight, style, zIndex } = render;
            let textRender: string | null = transformValue;
            if (isNil(textRender)) {
                return;
            }
            textRender = textRender.replace(/\r|\n/g, ' ');
            const fontWeight = style?.fontWeight;
            const textMaxWidth = columnWidth - AI_TABLE_CELL_PADDING - AI_TABLE_ACTION_COMMON_RIGHT_PADDING - AI_TABLE_ACTION_COMMON_SIZE;
            const { text, textWidth } = drawer.textEllipsis({
                text: textRender,
                maxWidth: textMaxWidth,
                fontWeight
            });

            return {
                x,
                y,
                text,
                wrap: 'none',
                width: textWidth,
                fillStyle: Colors.primary,
                height: rowHeight + 2,
                lineHeight: 1.84,
                listening: false,
                ellipsis: true,
                zIndex
            };
        }
        return;
    });

    iconConfig = computed<AITableActionIconConfig>(() => {
        const { coordinate, render, field, recordId, readonly } = this.config()!;
        const offsetX = render.columnWidth - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
        const offsetY = (coordinate.rowInitSize - AI_TABLE_ACTION_COMMON_SIZE) / 2;

        return {
            coordinate,
            readonly,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                source: AI_TABLE_CELL_EDIT,
                mouseStyle: readonly ? 'default' : 'pointer'
            }),
            x: offsetX,
            y: offsetY,
            data: EditPath,
            fill: Colors.gray600,
            hoverFill: Colors.primary,
            backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
            backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
            cornerRadius: AI_TABLE_ACTION_COMMON_RADIUS,
            listening: true
        };
    });
}
