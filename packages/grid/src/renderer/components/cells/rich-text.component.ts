import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL,
    AI_TABLE_CELL_EDIT,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_ROW_HEIGHT,
    AI_TABLE_TEXT_LINE_HEIGHT,
    Colors,
    DEFAULT_FONT_SIZE,
    EditPath
} from '../../../constants';
import { generateTargetName } from '../../../utils';
import { AITableActionIconConfig } from '../../../types';
import { AITableFieldType, isUndefinedOrNull } from '@ai-table/utils';
import { AITableActionIcon } from '../action-icon.component';
import { TextConfig } from 'konva/lib/shapes/Text';
import { drawer } from '../../drawers/drawer';
import { AITableTextComponent } from '../text.component';
import { CoverCellBase } from './cover-cell-base';

@Component({
    selector: 'ai-table-rich-text',
    template: `
        @if (textConfig()) {
            <ai-table-text [config]="textConfig()!"></ai-table-text>
        }
        <ai-table-action-icon [config]="iconConfig()"></ai-table-action-icon>
    `,
    imports: [AITableTextComponent, AITableActionIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellRichText extends CoverCellBase {
    static override fieldType = AITableFieldType.richText;

    textConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, y, transformValue, field, columnWidth, rowHeight, style, zIndex } = render;
            let textRender: string | null = transformValue;
            if (isUndefinedOrNull(textRender)) {
                return;
            }
            textRender = textRender.replace(/\r|\n/g, ' ');
            const textMaxWidth = columnWidth - AI_TABLE_CELL_PADDING - AI_TABLE_ACTION_COMMON_RIGHT_PADDING - AI_TABLE_ACTION_COMMON_SIZE;
            return {
                x,
                y: (AI_TABLE_ROW_HEIGHT - DEFAULT_FONT_SIZE * AI_TABLE_TEXT_LINE_HEIGHT) / 2,
                text: textRender,
                verticalAlign: 'top',
                wrap: 'char',
                width: textMaxWidth,
                fillStyle: Colors.primary,
                height: rowHeight + 2,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                listening: false,
                ellipsis: true
                // zIndex
            };
        }
        return;
    });

    iconConfig = computed<AITableActionIconConfig>(() => {
        const { coordinate, render, field, recordId, readonly } = this.config()!;
        const offsetX = render.columnWidth - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
        const offsetY = (AI_TABLE_ROW_HEIGHT - AI_TABLE_ACTION_COMMON_SIZE) / 2;

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
