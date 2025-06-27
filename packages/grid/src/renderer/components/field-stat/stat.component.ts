import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject, KoShape } from '../../../angular-konva';
import {
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AngleDownPath,
    Colors,
    DEFAULT_FONT_SIZE
} from '../../../constants';
import { AITableFieldStatConfig } from '../../../types';
import { AITableField, AITableFieldStatTypeItemInfo } from '@ai-table/utils';
import { FieldModelMap, generateTargetName, TextMeasure } from '../../../utils';
import { AITableIcon } from '../icon.component';
import { AITableTextComponent } from '../text.component';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITableStatMenu } from '../../../components/field-stat-menu/field-stat-menu.component';

@Component({
    selector: 'ai-table-field-stat',
    template: `
        <ko-group [config]="groupConfig()">
            <ko-rect [config]="bgConfig()" (koClick)="clickStat($event)"></ko-rect>
            @if (textConfig()) {
                <ko-group>
                    <ai-table-text [config]="textConfig()!"></ai-table-text>
                    <ai-table-icon [config]="iconConfig()"></ai-table-icon>
                </ko-group>
            }
        </ko-group>
    `,
    imports: [KoContainer, KoShape, AITableTextComponent, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldStat {
    thyPopover = inject(ThyPopover);

    config = input.required<AITableFieldStatConfig>();

    textOffset = AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;

    textMeasure = TextMeasure();

    availableTextWidth = computed(() => {
        const { width } = this.config();
        return width - AI_TABLE_ICON_COMMON_SIZE;
    });

    textData = computed(() => {
        const fieldName = this.config().field.name.replace(/\r|\n/g, ' ');
        this.textMeasure.setFont({ fontSize: DEFAULT_FONT_SIZE });
        const { width, height, isOverflow } = this.textMeasure.measureText(fieldName, this.availableTextWidth(), 1);
        return {
            width: Math.min(width, this.availableTextWidth()),
            height,
            isOverflow
        };
    });

    groupConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: this.config().x,
            y: this.config().y
        };
    });

    bgConfig = computed(() => {
        const { field, width, height } = this.config();
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            name: generateTargetName({
                targetName: 'sss',
                fieldId: field._id,
                mouseStyle: 'pointer'
            }),
            width: width,
            height: height,
            fill: Colors.white,
            stroke: Colors.gray200,
            strokeWidth: 1,
            opacity: 1
        };
    });

    field = computed(() => {
        const { field } = this.config();
        return field;
    });

    records = computed(() => {
        const { aiTable } = this.config();
        return aiTable.records;
    });

    statValue = computed(() => {
        const field = this.field();
        const records = this.records();
        const fieldModel = FieldModelMap[field.type];
        const result = fieldModel.getStatFormatValue(field, records());
        return result;
    });

    textConfig = computed(() => {
        const { field, height, aiTable } = this.config();
        const text = this.statValue();
        if (text) {
            return {
                x: this.textOffset,
                y: 0,
                width: Math.max(this.textData().width, AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH),
                height: height + 2,
                text: this.statValue(),
                lineHeight: 1.84
            };
        }

        return null;
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

    clickStat(e: KoEventObject<MouseEvent>) {
        e.event.evt.stopPropagation();
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

        const ref = this.thyPopover.open(AITableStatMenu, {
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
                statMenus: fieldModel.statTypes
                // fieldMenus:
            }
        });

        ref.componentInstance.menuClick.subscribe((event: { menu: AITableFieldStatTypeItemInfo; field: AITableField }) => {
            actions.setField({
                ...event.field,
                stat_type: event.menu.type
            });
        });
    }
}
