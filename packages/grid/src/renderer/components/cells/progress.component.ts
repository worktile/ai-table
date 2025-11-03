import { Component, computed, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { KoShape, KoEventObject } from '../../../angular-konva';
import { AITableFieldType, isUndefinedOrNull } from '@ai-table/utils';
import { generateTargetName } from '../../../utils';
import { CoverCellBase } from '../../../renderer';
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

@Component({
    selector: 'ai-table-progress',
    template: `
        @if (!readonly()) {
            <ko-rect [config]="whiteBgConfig()"></ko-rect>
        }
        <ko-rect [config]="railConfig()" (koClick)="koClick($event)"></ko-rect>
        <ko-rect [config]="trackConfig()" (koClick)="koClick($event)"></ko-rect>
        <ko-rect
            [config]="pointerConfig()"
            (koDragstart)="pointerDragstart($event)"
            (koDragmove)="pointerDragmove($event)"
            (koDragend)="pointerDragend($event)"
        ></ko-rect>
        <ko-text [config]="textConfig()"></ko-text>
    `,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellProgress extends CoverCellBase {
    static override fieldType = AITableFieldType.progress;

    readonly readonly = computed(() => {
        return this.config()?.readonly;
    });

    private dragPointerX = signal<number | null>(null);

    private railWidth = computed(() => {
        const { columnWidth } = this.config()!.render;
        return columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PROGRESS_TEXT_WIDTH;
    });

    private trackWidth = computed(() => {
        return (this.progressValue() / 100) * this.railWidth();
    });

    private pointerWidth = AI_TABLE_PROGRESS_BAR_POINTER_WIDTH;

    private progressOffsetY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PROGRESS_BAR_HEIGHT) / 2 + AI_TABLE_OFFSET;

    private dragProgressValue = signal<number | null>(null);

    private progressValue = computed(() => {
        const dragValue = this.dragProgressValue();
        if (dragValue !== null) {
            return dragValue;
        }

        const { render } = this.config()!;
        const { transformValue } = render;
        if (isUndefinedOrNull(transformValue)) {
            return 0;
        }
        return transformValue;
    });

    readonly whiteBgConfig = computed(() => {
        const { aiTable, render, field, recordId, coordinate } = this.config()!;
        const pointPosition = aiTable.context!.pointPosition();
        const { x, y, groupOffset = 0 } = render;
        const { columnIndex } = pointPosition;

        const hasSelectedArea =
            aiTable.selection().selectedCells.size > 0 ||
            aiTable.selection().selectedRecords.size > 0 ||
            aiTable.selection().selectedFields.size > 0;

        const bgColor = hasSelectedArea ? null : Colors.white;

        return {
            x: x - groupOffset - AI_TABLE_CELL_PADDING + AI_TABLE_CELL_BORDER / 2,
            y: y + AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET,
            width: coordinate.getColumnWidth(columnIndex) - (AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET) * 2 + AI_TABLE_CELL_BORDER / 2,
            height: coordinate.rowHeight - (AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET) - 1,
            fill: bgColor,
            stroke: bgColor,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId
            })
        };
    });

    readonly railConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x } = render;

        return {
            x,
            y: this.progressOffsetY,
            width: this.railWidth(),
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

    readonly trackConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x } = render;

        return {
            x,
            y: this.progressOffsetY,
            width: this.trackWidth(),
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

    readonly pointerConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x } = render;
        const halfPointerWidth = this.pointerWidth / 2;
        const pointerY = this.progressOffsetY - (AI_TABLE_PROGRESS_BAR_POINTER_HEIGHT - AI_TABLE_PROGRESS_BAR_HEIGHT) / 2;

        let pointerX: number;
        if (this.dragPointerX() !== null) {
            pointerX = this.dragPointerX()! - halfPointerWidth;
        } else {
            pointerX = x + this.trackWidth() - halfPointerWidth;
        }

        return {
            x: pointerX,
            y: pointerY,
            width: this.pointerWidth,
            height: AI_TABLE_PROGRESS_BAR_POINTER_HEIGHT,
            fill: Colors.white,
            stroke: Colors.success,
            strokeWidth: 1,
            cornerRadius: AI_TABLE_PROGRESS_BAR_RADIUS,
            opacity: this.readonly() ? 0 : 1,
            draggable: !this.readonly(),
            dragBoundFunc: (pos: { x: number; y: number }) => {
                const minX = x;
                const maxX = x + this.railWidth() - this.pointerWidth;

                return {
                    x: Math.min(minX, Math.min(maxX, pos.x)),
                    y: pointerY
                };
            },
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                mouseStyle: this.readonly() ? 'default' : 'pointer'
            })
        };
    });

    readonly textConfig = computed(() => {
        const { render, field, recordId } = this.config()!;
        const { x } = render;
        const textX = x + this.railWidth() + AI_TABLE_TEXT_GAP;
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

    private calculatePercentage(clickX: number): number {
        return Math.max(0, Math.min(100, Math.round((clickX / this.railWidth()) * 100)));
    }

    koClick(e: KoEventObject<MouseEvent>) {
        if (this.readonly()) {
            return;
        }
        this.updateProgressValue(e);
    }

    pointerDragstart(e: KoEventObject<MouseEvent>) {
        if (this.readonly()) {
            return;
        }
    }

    pointerDragmove(e: KoEventObject<MouseEvent>) {
        if (this.readonly()) {
            return;
        }

        const { render, aiTable, coordinate } = this.config()!;
        const { x, groupOffset = 0 } = render;
        const { scrollLeft } = aiTable.context!.scrollState();
        const pointPosition = aiTable.context!.pointPosition();
        const { columnIndex } = pointPosition;
        const columnLeftX = coordinate.getColumnOffset(columnIndex) - scrollLeft + AI_TABLE_OFFSET;

        const stage = e.event.target.getStage();
        if (!stage) return;

        const point = stage.getPointerPosition();
        if (!point) return;

        const dragX = point.x - columnLeftX - x - groupOffset;
        const minX = x;
        const maxX = x + this.railWidth();

        let dragPointerX = point.x - columnLeftX - groupOffset;
        if (dragPointerX < minX) {
            dragPointerX = minX;
        } else if (dragPointerX > maxX) {
            dragPointerX = maxX;
        }

        this.dragPointerX.set(dragPointerX);
        const percentage = this.calculatePercentage(dragX);
        this.dragProgressValue.set(percentage);
    }

    pointerDragend(e: KoEventObject<MouseEvent>) {
        if (this.readonly()) {
            return;
        }

        this.updateProgressValue(e);
        this.dragPointerX.set(null);
        this.dragProgressValue.set(null);
    }

    private updateProgressValue(e: KoEventObject<MouseEvent>): void {
        const { render, aiTable, coordinate, actions, field, recordId } = this.config()!;
        const { x, groupOffset = 0 } = render;
        const { scrollLeft } = aiTable.context!.scrollState();
        const pointPosition = aiTable.context!.pointPosition();
        const { columnIndex } = pointPosition;
        const columnLeftX = coordinate.getColumnOffset(columnIndex) - scrollLeft + AI_TABLE_OFFSET;

        const stage = e.event.target.getStage();
        if (!stage) return;

        const point = stage.getPointerPosition();
        if (!point) return;

        const dragX = point.x - columnLeftX - x - groupOffset;
        const percentage = this.calculatePercentage(dragX);

        if (!this.readonly() && actions && actions.updateFieldValues) {
            actions.updateFieldValues([
                {
                    value: percentage,
                    path: [recordId!, field._id]
                }
            ]);
        }
    }
}
