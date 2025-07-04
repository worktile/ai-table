import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject, KoShape } from '../../../angular-konva';
import {
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_TEXT_LINE_HEIGHT,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH,
    AI_TABLE_FIELD_STAT_BG,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_POPOVER_LEFT_OFFSET,
    AngleDownPath,
    Colors,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT
} from '../../../constants';
import { AITableFieldStatConfig } from '../../../types';
import { AITableField, AITableFieldStatTypeItemInfo, FieldOptions } from '@ai-table/utils';
import { FieldModelMap, generateTargetName, TextMeasure } from '../../../utils';
import { AITableIcon } from '../icon.component';
import { AITableTextComponent } from '../text.component';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITableStatTypeMenu } from '../../../components/stat-type-menu/stat-type-menucomponent';
import { AITableBackground } from '../background.component';
import { drawer } from '../../drawers/drawer';

@Component({
    selector: 'ai-table-field-stat',
    template: `
        <ko-group [config]="groupConfig()">
            <ai-table-background
                [config]="bgConfig()"
                (koClick)="clickStat($event)"
                [isActive]="isActive()"
                (hover)="onHoverChange($event)"
            ></ai-table-background>

            <ko-group>
                @if (textConfig()) {
                    <ai-table-text [config]="textConfig()!"></ai-table-text>
                    <ai-table-icon [config]="iconConfig()"></ai-table-icon>
                }
            </ko-group>
        </ko-group>
    `,
    imports: [KoContainer, AITableTextComponent, AITableIcon, AITableBackground],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldStat {
    thyPopover = inject(ThyPopover);

    config = input.required<AITableFieldStatConfig>();

    hover = output<boolean>();

    isActive = signal(false);

    availableTextWidth = computed(() => {
        const { width } = this.config();
        return width - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_CELL_PADDING;
    });

    textData = computed(() => {
        const textString = this.renderText() || '';
        const availableTextWidth = this.availableTextWidth();
        const { text, textWidth } = drawer.textEllipsis({
            text: textString,
            maxWidth: availableTextWidth,
            fontSize: DEFAULT_FONT_SIZE,
            fontWeight: DEFAULT_FONT_WEIGHT
        });

        return {
            width: textWidth,
            text
        };
    });

    groupConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: this.config().x,
            y: this.config().y
        };
    });

    bgConfig = computed(() => {
        const { field, width, height, coordinate, readonly } = this.config();
        return {
            coordinate,
            x: 0,
            y: 0,
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_STAT_BG,
                fieldId: field._id,
                mouseStyle: 'pointer'
            }),
            width: width,
            height: height,
            fill: Colors.white,
            hoverFill: Colors.gray100,
            opacity: 1,
            listening: !readonly
        };
    });

    field = computed(() => {
        const { field } = this.config();
        return field;
    });

    records = computed(() => {
        const { aiTable } = this.config();
        return aiTable.gridData().records;
    });

    aiFieldConfig = computed(() => {
        const { aiTable } = this.config();
        return aiTable.context?.aiFieldConfig;
    });

    aiTable = computed(() => {
        const { aiTable } = this.config();
        return aiTable;
    });

    options = computed<FieldOptions>(() => {
        const aiTable = this.aiTable();
        return {
            field: this.field(),
            aiTable
        };
    });

    isHoverStatContainer = computed(() => this.config().isHoverStatContainer);

    renderText = computed(() => {
        const field = this.field();
        const records = this.records();
        const fieldModel = FieldModelMap[field.type];
        const selectedInfo = this.selectedInfo();
        if (this.isFirstColumn() && selectedInfo.isSelected) {
            if (selectedInfo.selectedType === 'records') {
                return `已经选择 ${selectedInfo.selectedCount} 条记录`;
            } else {
                return `已经选择 ${selectedInfo.selectedCount} 个单元格`;
            }
        } else {
            const result = fieldModel.getStatFormatValue(records, this.options());
            if (!result && this.isHoverStatContainer()) {
                return `不展示`;
            }
            return result;
        }
    });

    containerBox = computed(() => {
        const { height, width } = this.config();
        return { height, width };
    });

    textConfig = computed(() => {
        const { height, width } = this.containerBox();
        const text = this.renderText();
        if (text) {
            const renderWidth = this.textData().width;
            return {
                x: width - AI_TABLE_ACTION_COMMON_SIZE - renderWidth,
                y: 0,
                width: renderWidth,
                height: height,
                text: this.textData().text,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                listening: false
            };
        }

        return null;
    });

    selectedRecordCount = computed(() => {
        const aiTable = this.aiTable();
        const selectedRecords = aiTable.selection().selectedRecords;
        return selectedRecords.size;
    });

    selectedCellCount = computed(() => {
        const aiTable = this.aiTable();
        const selectedCells = aiTable.selection().selectedCells;
        return selectedCells.size;
    });

    selectedInfo = computed(() => {
        const selectedRecordCount = this.selectedRecordCount();
        const selectedCellCount = this.selectedCellCount();
        const selectedCount = selectedRecordCount || selectedCellCount;
        const selectedType = selectedRecordCount > 0 ? 'records' : selectedCellCount > 0 ? 'cells' : null;
        const isSelected = selectedRecordCount > 0 || selectedCellCount > 1;
        const result = {
            isSelected,
            selectedType,
            selectedCount
        };
        return result;
    });

    isFirstColumn = computed(() => {
        const { columnIndex } = this.config();
        return columnIndex === 0;
    });

    iconConfig = computed(() => {
        const { field, width, height } = this.config();
        const commonIconOffsetY = (height - AI_TABLE_ACTION_COMMON_SIZE) / 2;
        return {
            x: width - AI_TABLE_ACTION_COMMON_SIZE,
            y: commonIconOffsetY,
            data: AngleDownPath,
            fill: Colors.gray600,
            background: Colors.transparent,
            backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
            backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
            cornerRadius: 4,
            listening: false
        };
    });

    onHoverChange(isHover: boolean) {
        this.hover.emit(this.isActive() || isHover);
    }

    clickStat(e: KoEventObject<MouseEvent>) {
        e.event.evt.stopPropagation();
        this.isActive.set(true);
        const { aiTable, coordinate, field, actions } = this.config();
        const statRect = e.event.target.getClientRect();
        const fieldGroupRect = e.event.target.getParent()?.getParent()?.getClientRect()!;
        const containerRect = coordinate!.container.getBoundingClientRect();

        const position = {
            x: containerRect.x + statRect.x,
            y: containerRect.y + statRect.y + statRect.height - 50
        };
        const editFieldPosition = {
            x: containerRect.x + fieldGroupRect.x - AI_TABLE_CELL_PADDING,
            y: containerRect.y + fieldGroupRect.y + fieldGroupRect.height
        };

        const editOrigin = coordinate!.container.querySelector('.konvajs-content') as HTMLElement;

        const fieldModel = FieldModelMap[field.type];

        const ref = this.thyPopover.open(AITableStatTypeMenu, {
            origin: coordinate!.container,
            originPosition: position,
            placement: 'topLeft',
            originActiveClass: undefined,
            insideClosable: true,
            initialState: {
                origin: editOrigin,
                position: editFieldPosition,
                aiTable,
                field,
                statMenus: fieldModel.getStatTypes(aiTable)
            }
        });

        ref.componentInstance.menuClick.subscribe((event: { menu: AITableFieldStatTypeItemInfo; field: AITableField }) => {
            this.isActive.set(false);
            actions.setField({
                ...event.field,
                stat_type: event.menu.type
            });
        });

        ref.afterClosed().subscribe(() => {
            this.isActive.set(false);
            this.hover.emit(false);
        });
    }
}
