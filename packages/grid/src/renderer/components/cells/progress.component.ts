import { Component, computed, input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { KoShape } from '../../../angular-konva';
import { HoverCellComponent } from '../../interfaces';
import { AITableHoverCellConfig } from '../../../types';
import { AITableFieldType } from '../../../core';
import { generateTargetName } from '../../../utils';
import { isActiveCell } from '../../../renderer';
import {
    Colors,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_OFFSET,
    AI_TABLE_CELL,
    AI_TABLE_CELL_BORDER,
    AI_TABLE_PROGRESS_BAR_HEIGHT,
    AI_TABLE_PROGRESS_TEXT_WIDTH,
    AI_TABLE_PROGRESS_BAR_RADIUS,
    AI_TABLE_PROGRESS_BAR_POINTER_WIDTH,
    AI_TABLE_PROGRESS_BAR_POINTER_HEIGHT,
    AI_TABLE_TEXT_GAP,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_TEXT_FILL
} from '../../../constants';
import { isNil } from 'lodash';

@Component({
    selector: 'ai-table-progress',
    template: `
        @if (!readonly()) {
            <ko-rect [config]="whiteBgConfig()"></ko-rect>
        }
        <ko-rect [config]="railConfig()"></ko-rect>
        <ko-rect [config]="trackConfig()"></ko-rect>
        <ko-rect [config]="pointerConfig()"></ko-rect>
        <ko-text [config]="textConfig()"></ko-text>
    `,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellProgress implements HoverCellComponent {
    static fieldType = AITableFieldType.progress;

    config = input<AITableHoverCellConfig>();

    readonly = computed(() => {
        return this.config()?.readonly;
    });

    progressValue = computed(() => {
        const { render } = this.config()!;
        const { cellValue } = render;
        if (isNil(cellValue)) {
            return 0;
        }
        return cellValue;
    });

    private progressOffsetY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PROGRESS_BAR_HEIGHT) / 2 + AI_TABLE_OFFSET;

    whiteBgConfig = computed(() => {
        const { aiTable, render, field, recordId } = this.config()!;
        const { x, y, columnWidth } = render;
        const isActive = isActiveCell([recordId!, field._id], aiTable);

        return {
            x: x - AI_TABLE_CELL_PADDING + AI_TABLE_CELL_BORDER,
            y: y + AI_TABLE_OFFSET + AI_TABLE_CELL_BORDER,
            width: columnWidth - (AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET) * 2,
            height: AI_TABLE_ROW_BLANK_HEIGHT - (AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET),
            fill: Colors.white,
            stroke: isActive ? null : Colors.white,
            zIndex: 0,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId
            })
        };
    });

    railConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x, columnWidth } = render;

        return {
            x,
            y: this.progressOffsetY,
            width: columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PROGRESS_TEXT_WIDTH,
            height: AI_TABLE_PROGRESS_BAR_HEIGHT,
            cornerRadius: AI_TABLE_PROGRESS_BAR_RADIUS,
            fill: Colors.gray200,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                mouseStyle: this.readonly() ? 'default' : 'pointer'
            })
        };
    });

    trackConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x, columnWidth } = render;
        const railWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PROGRESS_TEXT_WIDTH;
        const trackWidth = (this.progressValue() / 100) * railWidth;

        return {
            x,
            y: this.progressOffsetY,
            width: trackWidth,
            height: AI_TABLE_PROGRESS_BAR_HEIGHT,
            cornerRadius: AI_TABLE_PROGRESS_BAR_RADIUS,
            fill: Colors.success,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                mouseStyle: this.readonly() ? 'default' : 'pointer'
            })
        };
    });

    pointerConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x, columnWidth } = render;
        const trackWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PROGRESS_TEXT_WIDTH;
        const progressWidth = (this.progressValue() / 100) * trackWidth;
        const pointerWidth = AI_TABLE_PROGRESS_BAR_POINTER_WIDTH;
        const pointerX = x + progressWidth - pointerWidth / 2;
        const pointerY = this.progressOffsetY - (AI_TABLE_PROGRESS_BAR_POINTER_HEIGHT - AI_TABLE_PROGRESS_BAR_HEIGHT) / 2;

        return {
            x: pointerX,
            y: pointerY,
            width: pointerWidth,
            height: AI_TABLE_PROGRESS_BAR_POINTER_HEIGHT,
            fill: Colors.white,
            stroke: Colors.success,
            strokeWidth: 1,
            cornerRadius: AI_TABLE_PROGRESS_BAR_RADIUS,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                mouseStyle: this.readonly() ? 'default' : 'pointer'
            })
        };
    });

    textConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x, columnWidth } = render;
        const progressBarWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PROGRESS_TEXT_WIDTH;
        const textX = x + progressBarWidth + AI_TABLE_TEXT_GAP;
        const textY = (AI_TABLE_ROW_BLANK_HEIGHT - DEFAULT_FONT_SIZE) / 2 + AI_TABLE_OFFSET;

        return {
            x: textX,
            y: textY,
            text: `${this.progressValue()}%`,
            fill: DEFAULT_TEXT_FILL,
            fontFamily: DEFAULT_FONT_FAMILY,
            fontSize: DEFAULT_FONT_SIZE,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId
            })
        };
    });
}
