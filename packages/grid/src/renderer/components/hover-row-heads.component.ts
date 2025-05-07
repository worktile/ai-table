import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoContainer, KoShape } from '../../angular-konva';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ROW_DRAG,
    AI_TABLE_ROW_DRAG_ICON_WIDTH,
    AI_TABLE_ROW_HEAD,
    AI_TABLE_ROW_SELECT_CHECKBOX,
    Colors
} from '../../constants';
import { RendererContext } from '../../core';
import { AITableAreaType, AITableCheckType, AITablePointPosition, AITableRowHeadsConfig, AITableRowType } from '../../types';
import { generateTargetName } from '../../utils';
import { AITableIcon } from './icon.component';
import { DragType } from '@ai-table/utils';

@Component({
    selector: 'ai-table-hover-row-heads',
    template: `
        @for (config of headConfigs(); track config.recordId) {
            <ko-group [config]="{ x: 0, y: config.y, name: 'hover-heads' }">
                @if (config.bgConfig) {
                    <ko-rect [config]="config.bgConfig"></ko-rect>
                }
                @if (config.iconConfig) {
                    <ai-table-icon [config]="config.iconConfig"></ai-table-icon>
                }
                @if (config.dragConfig) {
                    <ai-table-icon [config]="config.dragConfig"></ai-table-icon>
                }
            </ko-group>
        }
    `,
    standalone: true,
    imports: [KoContainer, KoShape, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableHoverRowHeads {
    config = input.required<AITableRowHeadsConfig>();

    pointPosition = computed(() => {
        return this.config().aiTable.context!.pointPosition();
    });

    headConfigs = computed(() => {
        return this.createHoverRowHeads(this.pointPosition());
    });

    readonly = computed(() => {
        return this.config().readonly;
    });

    rowDragDisabled = computed(() => {
        return this.config().rowDragDisabled;
    });

    createHoverRowHeads = (pointPosition: AITablePointPosition) => {
        const { coordinate, rowStartIndex, rowStopIndex, aiTable } = this.config();
        const context = aiTable.context as RendererContext;
        const headConfigs: any[] = [];

        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            if (rowIndex > coordinate.rowCount - 1) {
                break;
            }

            const row = context.linearRows()[rowIndex];
            if (row == null) {
                continue;
            }

            const { type, _id: recordId } = row;
            if (type !== AITableRowType.record || recordId == null) {
                continue;
            }

            const isCheckedRow = aiTable.selection().selectedRecords.has(recordId);
            const { areaType, rowIndex: pointRowIndex, targetName } = pointPosition;

            if (!isCheckedRow && areaType === AITableAreaType.none) {
                continue;
            }

            let isHoverRow;
            if (pointRowIndex > -1 && !!context.linearRows().length && pointRowIndex < context.linearRows().length) {
                const { type: pointRowType, _id: pointRecordId } = context.linearRows()[pointRowIndex];
                isHoverRow = recordId === pointRecordId && pointRowType === AITableRowType.record && targetName !== AI_TABLE_FIELD_HEAD;
            }

            let operationGroup: { recordId: string; y: number; bgConfig: any; iconConfig?: any; dragConfig?: any };

            operationGroup = {
                recordId,
                y: coordinate.getRowOffset(rowIndex),
                bgConfig: {
                    name: generateTargetName({ targetName: AI_TABLE_ROW_HEAD, recordId }),
                    width: context.rowHeadWidth() + 1,
                    height: coordinate.rowHeight,
                    fill: Colors.transparent
                }
            };

            if (isCheckedRow || isHoverRow) {
                const iconOffsetY = (AI_TABLE_FIELD_HEAD_HEIGHT - 16) / 2;
                operationGroup.iconConfig = {
                    name: generateTargetName({
                        targetName: AI_TABLE_ROW_SELECT_CHECKBOX,
                        recordId
                    }),
                    x: AI_TABLE_CELL_PADDING + AI_TABLE_ROW_DRAG_ICON_WIDTH,
                    y: iconOffsetY,
                    type: isCheckedRow ? AITableCheckType.checked : AITableCheckType.unchecked,
                    fill: isCheckedRow || (targetName === AI_TABLE_ROW_SELECT_CHECKBOX && !isCheckedRow) ? Colors.primary : Colors.gray300
                };
                if (!this.readonly() && !this.rowDragDisabled()) {
                    operationGroup.dragConfig = {
                        name: generateTargetName({
                            targetName: AI_TABLE_ROW_DRAG,
                            recordId
                        }),
                        x: 0,
                        y: iconOffsetY,
                        type: DragType.record,
                        fill: Colors.gray600
                    };
                }
                headConfigs.push(operationGroup);
            }
        }

        return headConfigs;
    };
}
