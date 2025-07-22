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
import { AITableBackgroundConfig, AITableFieldStatConfig } from '../../../types';
import {
    AITableField,
    AITableFieldStatTypeItemInfo,
    AITableRecord,
    FieldOptions,
    FieldStatOptions,
    isUndefinedOrNull
} from '@ai-table/utils';
import {
    AITableGridI18nKey,
    AITableQueries,
    FieldModelMap,
    generateTargetName,
    getI18nTextByKey,
    TextMeasure,
    transformToCellText
} from '../../../utils';
import { AITableIcon } from '../icon.component';
import { AITableTextComponent } from '../text.component';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITableStatTypeMenu } from '../../../components/stat-type-menu/stat-type-menucomponent';
import { AITableBackground } from '../background.component';
import { drawer } from '../../drawers/drawer';
import _ from 'lodash';

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
                @if (textsConfig()) {
                    @for (textConfig of textsConfig(); track $index) {
                        <ai-table-text [config]="textConfig"></ai-table-text>
                    }
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

    isHover = signal(false);

    availableTextWidth = computed(() => {
        const { width } = this.config();
        return width - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_CELL_PADDING;
    });

    groupConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: this.config().x,
            y: this.config().y
        };
    });

    bgConfig = computed(() => {
        const { field, width, height, coordinate, readonly, aiTable } = this.config();
        const rowHeadWidth = aiTable.context!.rowHeadWidth();
        const config: AITableBackgroundConfig = {
            coordinate,
            x: 0,
            y: 0,
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_STAT_BG,
                fieldId: field._id,
                mouseStyle: 'pointer'
            }),
            width: this.isFirstColumn() ? width + AI_TABLE_OFFSET : width,
            height: height,
            fill: Colors.white,
            hoverFill: Colors.gray100,
            opacity: 1,
            listening: !readonly
        };
        if (this.renderTexts()) {
            config.borders = [false, true, false, true];
            config.stroke = Colors.gray200;
            config.strokeWidth = AI_TABLE_CELL_LINE_BORDER;
        }

        if (this.isFirstColumn()) {
            if (rowHeadWidth === 0) {
                config.borders = [false, true, false, false];
            } else {
                config.borders = [false, true, false, true];
            }
            config.stroke = Colors.gray200;
            config.strokeWidth = AI_TABLE_CELL_LINE_BORDER;
        }
        return config;
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

    options = computed<FieldStatOptions>(() => {
        const aiTable = this.aiTable();
        return {
            field: this.field(),
            aiTable,
            getFieldValue: (record: AITableRecord, options: FieldOptions) => {
                const { aiTable, field } = options;
                const cellValue = AITableQueries.getFieldValue(aiTable, [record._id, field!._id]);
                return transformToCellText(cellValue, options);
            }
        };
    });

    isActiveOrHover = computed(() => {
        return this.isActive() || this.isHover();
    });

    renderTexts = computed(() => {
        const { height, width } = this.containerBox();
        const field = this.field();
        const records = this.records();
        const fieldModel = FieldModelMap[field.type];
        const selectedInfo = this.selectedInfo();
        let resultString = null;
        let formatString = null;
        let statValue = '';
        if (this.isFirstColumn() && selectedInfo.isSelected) {
            if (selectedInfo.selectedType === 'records') {
                formatString = getI18nTextByKey(this.aiTable(), AITableGridI18nKey.selectedRecordsCount);
            } else {
                formatString = getI18nTextByKey(this.aiTable(), AITableGridI18nKey.selectedCellsCount);
            }
            resultString = formatString.replace('{count}', `${selectedInfo.selectedCount.toString()}`);
            statValue = selectedInfo.selectedCount.toString();
        } else {
            statValue = fieldModel.stat(records, this.options());
            if (!isUndefinedOrNull(statValue)) {
                formatString = fieldModel.getFormat(this.field(), this.aiTable());
                if (formatString) {
                    resultString = formatString.replace('{{statValue}}', `${statValue.toString()}`);
                    statValue = statValue.toString();
                }
            } else if (this.isActiveOrHover()) {
                formatString = getI18nTextByKey(this.aiTable(), AITableGridI18nKey.stat);
                resultString = getI18nTextByKey(this.aiTable(), AITableGridI18nKey.stat);
            }
        }
        if (!resultString) {
            return null;
        }

        const { text, textWidth } = drawer.textEllipsis({
            text: resultString,
            maxWidth: width - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_CELL_PADDING,
            fontSize: DEFAULT_FONT_SIZE,
            fontWeight: DEFAULT_FONT_WEIGHT
        });

        return {
            texts: text.split(' '),
            totalWidth: textWidth,
            statValue: statValue || ''
        };
    });

    containerBox = computed(() => {
        const { height, width } = this.config();
        return { height, width };
    });

    textsConfig = computed(() => {
        const { height, width } = this.containerBox();
        const renderTexts = this.renderTexts();
        const result = [];
        let previousColor = Colors.gray700;
        if (renderTexts) {
            const { texts, totalWidth, statValue } = renderTexts;
            let remainingWidth = width - AI_TABLE_ACTION_COMMON_SIZE;
            for (const [index, text] of texts.entries()) {
                if (remainingWidth <= 0) {
                    break;
                }
                let isLast = index === texts.length - 1;
                let isStatValue = statValue.includes(text.replace('%', '').replace('…', ''));
                let isEllipsis = text === '…';
                const { text: renderText, textWidth } = drawer.textEllipsis({
                    text: isLast ? text : `${text} `,
                    maxWidth: remainingWidth,
                    fontSize: DEFAULT_FONT_SIZE,
                    fontWeight: DEFAULT_FONT_WEIGHT
                });
                remainingWidth -= textWidth;
                let fill;
                if (isStatValue) {
                    fill = Colors.gray700;
                } else if (isEllipsis) {
                    fill = previousColor;
                } else {
                    fill = Colors.gray600;
                }

                result.push({
                    x: 0,
                    y: 0,
                    width: textWidth,
                    height: height,
                    fill,
                    text: renderText,
                    lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                    listening: false
                });
                previousColor = fill;
            }
            let startX = width - AI_TABLE_ACTION_COMMON_SIZE - totalWidth;
            result.forEach((item) => {
                item.x = startX;
                startX += item.width;
            });
            return result;
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
        this.isHover.set(isHover);
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
            actions.setFieldStatType({
                path: [field._id],
                statType: event.menu.type
            });
        });

        ref.afterClosed().subscribe(() => {
            this.isActive.set(false);
            this.hover.emit(false);
        });
    }
}
