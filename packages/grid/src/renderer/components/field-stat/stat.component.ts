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
import { AITableBackgroundConfig, AITableFieldStatConfig, AITableGroupStatConfig, AITableRowType } from '../../../types';
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
                    @if (!isShowSelectedCount) {
                        <ai-table-icon [config]="iconConfig()"></ai-table-icon>
                    }
                }
            </ko-group>
        </ko-group>
    `,
    imports: [KoContainer, AITableTextComponent, AITableIcon, AITableBackground],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldStat {
    thyPopover = inject(ThyPopover);

    config = input.required<AITableGroupStatConfig | AITableFieldStatConfig>();

    hover = output<boolean>();

    isActive = signal(false);

    isHover = signal(false);

    isShowSelectedCount = false;

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

    isGroupStat = computed(() => {
        return (this.config() as AITableGroupStatConfig).isGroupStat;
    });

    bgConfig = computed(() => {
        const { field, width, height, coordinate, readonly, aiTable, isGroupStat, columnIndex } = this.config() as AITableGroupStatConfig;

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
            width: width,
            height: height,
            fill: Colors.white,
            hoverFill: Colors.gray100,
            opacity: 1,
            listening: !readonly
        };

        if (isGroupStat) {
            if (columnIndex === 0) {
                const textsConfig = this.textsConfig();
                if (textsConfig) {
                    config.x = textsConfig[0].x - AI_TABLE_CELL_PADDING;
                    config.width = config.width - config.x;
                } else {
                    config.width = this.noneStatWidth();
                    config.x = width - this.noneStatWidth();
                    config.fill = Colors.transparent;
                }
            }
        } else {
            if (this.renderTexts()) {
                config.borders = [false, true, false, true];
                config.stroke = Colors.gray200;
                config.strokeWidth = AI_TABLE_CELL_LINE_BORDER;
            } else if (this.isLastFrozenColumn()) {
                config.borders = [false, true, false, false];
                config.stroke = Colors.gray200;
                config.strokeWidth = AI_TABLE_CELL_LINE_BORDER;
            }

            if (this.isFirstColumn()) {
                if (rowHeadWidth === 0) {
                    config.borders = [false, true, false, false];
                } else {
                    config.x = -AI_TABLE_OFFSET;
                    config.width = config.width + AI_TABLE_OFFSET;
                    config.borders = [false, true, false, true];
                }
                config.stroke = Colors.gray200;
                config.strokeWidth = AI_TABLE_CELL_LINE_BORDER;
            }
        }
        return config;
    });

    field = computed(() => {
        const { field } = this.config();
        return field;
    });

    linearRows = computed(() => {
        const { aiTable } = this.config();
        return aiTable.context?.linearRows();
    });

    recordsMap = computed(() => {
        const { aiTable } = this.config();
        return aiTable.recordsMap();
    });

    groupRow = computed(() => (this.config() as AITableGroupStatConfig).groupRow);

    gridData = computed(() => this.config().aiTable!.gridData());

    records = computed(() => {
        let records: AITableRecord[] = [];
        const groupRow = this.groupRow();
        if (this.isGroupStat()) {
            if (groupRow.range?.length === 2) {
                records = this.gridData().records.slice(groupRow.range[0], groupRow.range[1] + 1);
            }
        } else {
            records = this.gridData().records;
        }
        return records;
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

    containerBoxHeight = computed(() => {
        const { height } = this.config();
        return height;
    });

    containerBoxWidth = computed(() => {
        const { width } = this.config();
        return width;
    });

    noneStatWidth = computed(() => {
        const noneStatString = getI18nTextByKey(this.aiTable(), AITableGridI18nKey.stat);
        const { text, textWidth } = drawer.textEllipsis({
            text: noneStatString,
            fontSize: DEFAULT_FONT_SIZE,
            fontWeight: DEFAULT_FONT_WEIGHT
        });
        return textWidth + AI_TABLE_ACTION_COMMON_SIZE + AI_TABLE_OFFSET;
    });

    renderTexts = computed(() => {
        const width = this.containerBoxWidth();
        const field = this.field();
        const records = this.records();
        const fieldModel = FieldModelMap[field.type];
        const selectedInfo = this.selectedInfo();
        let resultString = null;
        let formatString = null;
        let statValue = '';
        if (this.isFirstColumn() && selectedInfo.isSelected && !this.isGroupStat()) {
            if (selectedInfo.selectedType === 'records') {
                formatString = getI18nTextByKey(this.aiTable(), AITableGridI18nKey.selectedRecordsCount);
            } else {
                formatString = getI18nTextByKey(this.aiTable(), AITableGridI18nKey.selectedCellsCount);
            }
            this.isShowSelectedCount = true;
            resultString = formatString.replace('{count}', `${selectedInfo.selectedCount.toString()}`);
            statValue = selectedInfo.selectedCount.toString();
        } else {
            this.isShowSelectedCount = false;
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
            texts: text.split(/\s+/),
            totalWidth: textWidth,
            statValue: statValue || ''
        };
    });

    textsConfig = computed(() => {
        const height = this.containerBoxHeight();
        const width = this.containerBoxWidth();
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
            let startX = width - totalWidth;
            if (!this.isShowSelectedCount) {
                startX -= AI_TABLE_ACTION_COMMON_SIZE;
            } else {
                startX -= AI_TABLE_CELL_PADDING;
            }
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

    isLastFrozenColumn = computed(() => {
        const { columnIndex, coordinate } = this.config();
        return columnIndex === coordinate.frozenColumnCount - 1;
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
