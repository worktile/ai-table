import { ChangeDetectionStrategy, Component, computed, effect, input, SimpleChanges } from '@angular/core';
import { KoContainer, KoShape } from '../../angular-konva';
import { AITableCellsConfig, AITableHoverCellConfig } from '../../types';
import { AITableField, AITableFieldType, AITableQueries } from '../../core';
import { AITableCellLink } from './cells/link.component';
import { CommonModule } from '@angular/common';
import {
    AI_TABLE_CELL_BORDER,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_OFFSET,
    Colors,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ALIGN_RIGHT
} from '../../constants';
import { getCellHorizontalPosition, getHoverCell, transformCellValue } from '../../utils';
import { isSelectedField } from '../creations/create-cells';
import _ from 'lodash';

import * as cellComponents from './cells';
import { HoverCellComponent } from '../interfaces';
import { Constructor } from 'ngx-tethys/core';

@Component({
    selector: 'ai-table-hover-cell',
    template: `
        @if (hoverCell()) {
            <ko-group [config]="groupConfig()">
                <ng-container *ngComponentOutlet="hoverCell()!.renderComponentDefinition; inputs: { config: hoverCellConfig() }">
                </ng-container>
            </ko-group>
        }
    `,
    standalone: true,
    imports: [KoShape, KoContainer, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableHoverCells {
    config = input.required<AITableCellsConfig>();

    componentMap: Partial<Record<AITableFieldType, Constructor<HoverCellComponent>>> = {};

    groupConfig = computed(() => {
        return {
            x: this.hoverCellConfig()?.x,
            y: this.hoverCellConfig()?.y
        };
    });

    hoverCellConfig = computed(() => {
        const { aiTable, coordinate, references, readonly } = this.config();
        const pointPosition = aiTable.context!.pointPosition();
        const hoverCell = this.hoverCell();
        if (!hoverCell) {
            return;
        }
        const { field, recordId, fieldId, renderComponentDefinition } = hoverCell;
        const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, field._id]);
        const transformValue = transformCellValue(aiTable, field, cellValue);

        const { rowHeight, columnCount, rowCount } = coordinate;
        const columnIndex = pointPosition.columnIndex;
        const rowIndex = pointPosition.rowIndex;

        const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
        const { width } = getCellHorizontalPosition({
            columnWidth,
            columnIndex,
            columnCount
        });

        const style = {
            textAlign: DEFAULT_TEXT_ALIGN_LEFT
        } as any;
        const textAlign = style.textAlign;
        const renderX =
            textAlign === DEFAULT_TEXT_ALIGN_RIGHT
                ? columnWidth - AI_TABLE_CELL_PADDING + AI_TABLE_OFFSET
                : AI_TABLE_CELL_PADDING + AI_TABLE_OFFSET;
        const renderY = 0 - AI_TABLE_OFFSET * 2;

        const result: AITableHoverCellConfig = {
            field,
            recordId,
            aiTable,
            coordinate,
            x,
            y,
            readonly,
            render: {
                aiTable,
                recordId,
                field,
                isActive: isSelectedField(field._id, aiTable),
                x: renderX,
                y: renderY,
                columnWidth: width,
                rowHeight,
                cellValue,
                transformValue,
                style,
                references
            }
        };

        return result;
    });

    hoverCell = computed(() => getHoverCell(this.config().aiTable));
}
