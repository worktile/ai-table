import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, ViewChild } from '@angular/core';
import { KoContainer } from '../../angular-konva';
import { AITableCellsConfig, AITableCoverCellConfig } from '../../types';
import { AITableFieldType } from '@ai-table/utils';
import { CommonModule } from '@angular/common';
import { AI_TABLE_CELL_PADDING, AI_TABLE_OFFSET, DEFAULT_TEXT_ALIGN_LEFT, DEFAULT_TEXT_ALIGN_RIGHT } from '../../constants';
import { AITableQueries, FieldModelMap, getCellHorizontalPosition, getCoverCell } from '../../utils';
import { isSelectedField } from '../creations/create-cells';
import _ from 'lodash';
import { Constructor } from 'ngx-tethys/core';
import { BaseCoverCell } from './cells/base-cover-cell';

@Component({
    selector: 'ai-table-cover-cell-entry',
    template: `
        @if (coverCell()) {
            <ko-group #rootGroup [config]="groupConfig()">
                <ng-container
                    *ngComponentOutlet="
                        coverCell()!.renderComponentDefinition;
                        inputs: { config: coverCellConfig(), onlyDisplayBorder: onlyDisplayBorder(), parentContainer: rootGroup }
                    "
                >
                </ng-container>
            </ko-group>
        }
    `,
    imports: [KoContainer, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCoverCellEntry implements AfterViewInit {
    @ViewChild('rootGroup') rootGroup!: KoContainer;

    ngAfterViewInit() {}

    config = input.required<AITableCellsConfig>();

    onlyDisplayBorder = input<boolean>(false);

    componentMap: Partial<Record<AITableFieldType, Constructor<BaseCoverCell>>> = {};

    groupConfig = computed(() => {
        return {
            x: this.coverCellConfig()?.x,
            y: this.coverCellConfig()?.y,
            listening: true
        };
    });

    coverCellConfig = computed<AITableCoverCellConfig | undefined>(() => {
        const { aiTable, coordinate, references, readonly, actions } = this.config();
        const coverCell = this.coverCell();
        if (!coverCell) {
            return;
        }
        const { field, recordId, isExpand } = coverCell;
        const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, field._id]);
        const fieldModel = FieldModelMap[field.type];
        const transformValue = fieldModel.transformCellValue(cellValue, { aiTable, field });

        const { rowHeight, columnCount, rowCount } = coordinate;

        const columnIndex = aiTable.context?.visibleColumnsIndexMap().get(field._id) ?? 0;
        const rowIndex = aiTable.context?.visibleRowsIndexMap().get(recordId) ?? 0;

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
        const result: AITableCoverCellConfig = {
            field,
            recordId,
            aiTable,
            coordinate,
            x,
            y,
            readonly,
            actions,
            isExpand,
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

    coverCell = computed(() => getCoverCell(this.config().aiTable));
}
