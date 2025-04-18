import { Component, computed, input, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { KoShape, KoEventObject } from '../../../angular-konva';
import { HoverCellComponent } from '../../interfaces';
import { AITableHoverCellConfig } from '../../../types';
import { AITableFieldType } from '../../../core';
import { generateTargetName } from '../../../utils';
import { isActiveCell } from '../../../renderer';
import {
    StarFill,
    Colors,
    AI_TABLE_CELL_EMOJI_PADDING,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_CELL_EMOJI_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_CELL,
    AI_TABLE_RATE_MAX,
    AI_TABLE_CELL_BORDER
} from '../../../constants';

@Component({
    selector: 'ai-table-rate',
    template: `
        @if (!readonly()) {
            <ko-rect [config]="whiteBgConfig()" (koMousemove)="koMousemove($event)"></ko-rect>
        }
        @for (config of starConfigs(); let index = $index; track $index) {
            <ko-path [config]="config" (koClick)="koClick($event, index)"></ko-path>
        }
    `,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellRate implements HoverCellComponent {
    static fieldType = AITableFieldType.rate;

    private pointerX = signal<number>(0);

    private pointerY = signal<number>(0);

    private resetStatus = signal<boolean>(false);

    config = input<AITableHoverCellConfig>();

    readonly = computed(() => {
        return this.config()?.readonly;
    });

    whiteBgConfig = computed(() => {
        const { aiTable, render, field, recordId, coordinate } = this.config()!;
        const pointPosition = aiTable.context!.pointPosition();
        const { x, y } = render;
        const { columnIndex } = pointPosition;
        const isActive = isActiveCell([recordId!, field._id], aiTable);

        return {
            x: x - AI_TABLE_CELL_PADDING + AI_TABLE_CELL_BORDER,
            y: y + AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET,
            width: coordinate.getColumnWidth(columnIndex) - (AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET) * 2,
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

    starConfigs = computed(() => {
        const { render, field, recordId, readonly, aiTable, coordinate } = this.config()!;
        const { x, transformValue } = render;
        const max = AI_TABLE_RATE_MAX;
        const starY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_CELL_EMOJI_SIZE) / 2 + AI_TABLE_OFFSET;

        const pointPosition = aiTable.context!.pointPosition();
        const { rowIndex, columnIndex } = pointPosition;
        const { scrollLeft, scrollTop } = aiTable.context!.scrollState();
        const columnLeftX = coordinate.getColumnOffset(columnIndex) - scrollLeft + AI_TABLE_OFFSET;
        const columnTopY = coordinate.getRowOffset(rowIndex) - scrollTop + AI_TABLE_OFFSET;
        const firstStarLeftX = columnLeftX + AI_TABLE_CELL_PADDING;
        const lastStarRightX =
            columnLeftX + AI_TABLE_CELL_PADDING + max * AI_TABLE_CELL_EMOJI_SIZE + (max - 1) * AI_TABLE_CELL_EMOJI_PADDING;
        const startTopY = columnTopY + starY;
        const startBottomY = columnTopY + starY + AI_TABLE_CELL_EMOJI_SIZE;

        const isHoverStar =
            this.pointerX() >= firstStarLeftX &&
            this.pointerX() <= lastStarRightX &&
            this.pointerY() >= startTopY &&
            this.pointerY() <= startBottomY;

        return [...Array(max).keys()].map((item, index) => {
            const value = index + 1;
            const checked = value <= transformValue;
            const starX = x + index * (AI_TABLE_CELL_EMOJI_SIZE + AI_TABLE_CELL_EMOJI_PADDING);

            let fill = null;
            if (this.resetStatus()) {
                fill = Colors.gray100;
            } else {
                if (isHoverStar) {
                    fill = columnLeftX + starX <= this.pointerX() ? Colors.waring : Colors.gray100;
                } else {
                    fill = checked ? Colors.waring : Colors.gray100;
                }
            }

            return {
                x: starX,
                y: starY,
                size: 22,
                data: StarFill,
                fill,
                scaleX: 1.14,
                scaleY: 1.14,
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId,
                    mouseStyle: readonly ? 'default' : 'pointer'
                })
            };
        });
    });

    koMousemove(e: KoEventObject<MouseEvent>) {
        if (this.readonly()) {
            return;
        }

        this.resetStatus.set(false);
        const pos = e.event.target.getStage()?.getPointerPosition();
        if (!pos) return;
        const { x, y } = pos;
        this.pointerX.set(x);
        this.pointerY.set(y);
    }

    koClick(e: KoEventObject<MouseEvent>, index: number) {
        if (this.readonly()) {
            return;
        }

        this.resetStatus.set(false);
        const { render, readonly, field, recordId, actions } = this.config()!;
        const { transformValue } = render;

        let value = index + 1;
        if (transformValue === value) {
            value = 0;
            this.resetStatus.set(true);
        }

        if (!readonly && actions && actions.updateFieldValue) {
            actions.updateFieldValue({
                value,
                path: [recordId!, field._id]
            });
        }
    }
}
