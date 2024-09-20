import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_HEAD_WIDTH,
    Colors
} from '../../constants';
import { AITableCheckType, AITableCreateHeadsOptions } from '../../types';
import { KoCoreShape } from './components/core-shape.component';
import { KoFieldHead } from './components/field-head.component';
import { KoIcon } from './components/icon.component';
import { KoStage } from './components/stage.component';

@Component({
    selector: 'ai-table-frozen-column-heads',
    template: `
        <ko-rect [config]="numberHeadBgConfig()"></ko-rect>
        <ko-line [config]="topLineConfig"></ko-line>
        <ko-line [config]="bottomLineConfig()"></ko-line>
        <ko-icon [options]="iconConfig()"></ko-icon>

        @for (config of headConfigs(); track $index) {
            <ko-field-head [config]="config"></ko-field-head>
        }
        <ko-rect [config]="headBgConfig()"></ko-rect>
    `,
    standalone: true,
    imports: [KoStage, KoCoreShape, KoFieldHead, KoIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenColumnHeads {
    options = input.required<AITableCreateHeadsOptions>();

    coordinate = computed(() => {
        return this.options().coordinate;
    });

    isChecked = computed(() => {
        return this.options().aiTable.selection().selectedRecords.size === this.options().aiTable.records().length;
    });

    numberHeadBgConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width: AI_TABLE_ROW_HEAD_WIDTH,
            height: this.coordinate().rowInitSize,
            fill: '#f00',
            listening: false
        };
    });

    topLineConfig = {
        x: AI_TABLE_OFFSET,
        y: AI_TABLE_OFFSET,
        points: [0, 0, AI_TABLE_ROW_HEAD_WIDTH, 0],
        stroke: Colors.gray200,
        strokeWidth: 1,
        listening: false
    };

    bottomLineConfig = computed(() => {
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            points: [AI_TABLE_ROW_HEAD_WIDTH, this.coordinate().rowInitSize, 0, this.coordinate().rowInitSize],
            stroke: Colors.gray200,
            strokeWidth: 1,
            listening: false
        };
    });

    iconConfig = computed(() => {
        return {
            name: AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
            x: AI_TABLE_CELL_PADDING,
            y: (this.coordinate().rowInitSize - AI_TABLE_ICON_COMMON_SIZE) / 2,
            type: this.isChecked() ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill: this.isChecked() ? Colors.primary : Colors.gray300
        };
    });

    headBgConfig = computed(() => {
        return {
            x: AI_TABLE_ROW_HEAD_WIDTH,
            y: AI_TABLE_OFFSET,
            width: this.coordinate().frozenColumnWidth,
            height: this.coordinate().rowInitSize,
            stroke: Colors.gray200,
            strokeWidth: 1,
            fill: Colors.transparent,
            listening: false
        };
    });

    headConfigs = computed(() => {
        let configs = [];
        const columnStopIndex = this.coordinate().frozenColumnCount - 1;
        for (let columnIndex = 0; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > this.coordinate().columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = this.options().fields[columnIndex];
            if (field == null) continue;

            const x = this.coordinate().getColumnOffset(columnIndex);
            const columnWidth = this.coordinate().getColumnWidth(columnIndex);
            const { iconVisible, isSelected, isHoverIcon } = this.getFieldHeadStatus(field._id);

            configs.push({
                x,
                y: 0,
                width: columnWidth,
                height: this.coordinate().rowInitSize,
                field: this.options().fields[columnIndex],
                stroke: columnIndex === 0 ? Colors.transparent : undefined,
                iconVisible,
                isSelected,
                isHoverIcon
            });
        }
        return configs;
    });

    getFieldHeadStatus(fieldId: string) {
        const { aiTable, fields, pointPosition } = this.options();
        const { columnIndex: pointColumnIndex, targetName: pointTargetName } = pointPosition;
        const iconVisible =
            [AI_TABLE_FIELD_HEAD, AI_TABLE_FIELD_HEAD_MORE].includes(pointTargetName) && fields[pointColumnIndex]?._id === fieldId;
        const isHoverIcon = pointTargetName === AI_TABLE_FIELD_HEAD_MORE && fields[pointColumnIndex]?._id === fieldId;
        const isSelected = aiTable.selection().selectedFields.has(fieldId);
        return {
            iconVisible,
            isSelected,
            isHoverIcon
        };
    }
}

@Component({
    selector: 'ai-table-column-heads',
    template: `
        @for (config of headConfigs(); track $index) {
            <ko-field-head [config]="config"></ko-field-head>
        }
    `,
    standalone: true,
    imports: [KoCoreShape, KoFieldHead],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableColumnHeads {
    options = input.required<AITableCreateHeadsOptions>();

    coordinate = computed(() => {
        return this.options().coordinate;
    });

    isChecked = computed(() => {
        return this.options().aiTable.selection().selectedRecords.size === this.options().aiTable.records().length;
    });

    headConfigs = computed(() => {
        const { coordinate, columnStartIndex, columnStopIndex } = this.options();
        const { frozenColumnCount } = coordinate;
        return this.getColumnHead(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex);
    });

    getFieldHeadStatus(fieldId: string) {
        const { aiTable, fields, pointPosition } = this.options();
        const { columnIndex: pointColumnIndex, targetName: pointTargetName } = pointPosition;
        const iconVisible =
            [AI_TABLE_FIELD_HEAD, AI_TABLE_FIELD_HEAD_MORE].includes(pointTargetName) && fields[pointColumnIndex]?._id === fieldId;
        const isHoverIcon = pointTargetName === AI_TABLE_FIELD_HEAD_MORE && fields[pointColumnIndex]?._id === fieldId;
        const isSelected = aiTable.selection().selectedFields.has(fieldId);
        return {
            iconVisible,
            isSelected,
            isHoverIcon
        };
    }

    getColumnHead = (columnStartIndex: number, columnStopIndex: number) => {
        const configs = [];
        const { fields } = this.options();
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > this.coordinate().columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = fields[columnIndex];
            if (field == null) continue;
            const x = this.coordinate().getColumnOffset(columnIndex);
            const columnWidth = this.coordinate().getColumnWidth(columnIndex);
            const { iconVisible, isSelected, isHoverIcon } = this.getFieldHeadStatus(field._id);

            configs.push({
                x,
                y: 0,
                width: columnWidth,
                height: this.coordinate().rowInitSize,
                field,
                stroke: columnIndex === 0 ? Colors.transparent : undefined,
                iconVisible,
                isSelected,
                isHoverIcon
            });
        }
        return configs;
    };
}
