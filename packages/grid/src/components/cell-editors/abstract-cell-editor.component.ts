import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, Input, OnInit, output, Renderer2 } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { AITable, AITableQueries } from '../../core';
import { AITableField, AITableReferences, UpdateFieldValueOptions } from '@ai-table/utils';
import { AI_TABLE_RECORD_HEIGHT_LEVELS } from '../../constants';
import { coerceBooleanProperty } from 'ngx-tethys/util';

@Component({
    selector: 'abstract-edit-cell',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractEditCellEditor<TValue, TFieldType extends AITableField = AITableField> implements OnInit {
    @Input({ required: true }) aiTable!: AITable;

    @Input({ required: true }) fieldId!: string;

    @Input({ required: true }) recordId!: string;

    @Input({ required: true }) references!: AITableReferences;

    recordHeight = input<number>(AI_TABLE_RECORD_HEIGHT_LEVELS.low);

    autoFocus = input(true, { transform: coerceBooleanProperty });

    updateFieldValues = output<UpdateFieldValueOptions<TValue>[]>();

    modelValue!: TValue;

    field = computed(() => {
        return this.aiTable.fieldsMap()[this.fieldId] as TFieldType;
    });

    record = computed(() => {
        return this.aiTable.recordsMap()[this.recordId];
    });

    elementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

    protected thyPopoverRef = inject(ThyPopoverRef<AbstractEditCellEditor<TValue>>, { optional: true });

    protected render2 = inject(Renderer2);

    protected minHeight = 24;

    ngOnInit(): void {
        this.modelValue = AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
    }

    applyContainerClass(className: string): void {
        const container = this.elementRef.nativeElement.closest('.grid-cell-editor');
        if (container) {
            this.render2.addClass(container, className);
        }
    }

    update() {
        if (this.modelValue === AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id])) {
            return;
        }
        this.updateFieldValues.emit([
            {
                value: this.modelValue,
                path: [this.record()._id, this.field()._id]
            }
        ]);
    }

    closePopover() {
        this.thyPopoverRef?.close();
    }

    /**
     * 调整高度
     * @param selector 选择器
     * @param isSetHeight 是否判断滚动高度小于行高才设置高度，否则使用自动高度（多选内容需要自动撑开，当内容高度不够行高以行高为准）
     * @param onHeightAdjusted
     */
    protected adjustElementHeight(selector: string, isSetHeight: boolean, onHeightAdjusted?: () => void) {
        const element = this.elementRef.nativeElement.querySelector(selector) as HTMLElement;
        if (element) {
            // 先设置为 auto 计算实际内容高度
            this.render2.setStyle(element, 'height', 'auto');

            queueMicrotask(() => {
                let scrollHeight = element.scrollHeight;
                const newHeight = Math.max(AI_TABLE_RECORD_HEIGHT_LEVELS.low, Math.min(scrollHeight, AI_TABLE_RECORD_HEIGHT_LEVELS.high));

                if (isSetHeight || scrollHeight < this.recordHeight()) {
                    this.render2.setStyle(element, 'height', `${Math.max(newHeight, this.recordHeight())}px`);
                    this.render2.setStyle(element, 'max-height', `${AI_TABLE_RECORD_HEIGHT_LEVELS.high}px`);
                } else {
                    this.render2.setStyle(element, 'max-height', 'none');
                }

                onHeightAdjusted?.();
            });
        }
    }
}
