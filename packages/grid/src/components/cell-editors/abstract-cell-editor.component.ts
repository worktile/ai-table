import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, Input, OnInit, output, Renderer2 } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { AITable, AITableQueries } from '../../core';
import { AITableField, AITableReferences, UpdateFieldValueOptions } from '@ai-table/utils';
import { ROW_HEIGHT_LEVELS } from '../../constants';

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

    rowHeight = input<number>(ROW_HEIGHT_LEVELS.low);

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

    protected adjustElementHeight(selector: string, needsSubtractPadding: boolean = false, onHeightAdjusted?: () => void) {
        const element = this.elementRef.nativeElement.querySelector(selector) as HTMLElement;
        if (element) {
            // 先设置为 auto 以计算实际内容高度
            this.render2.setStyle(element, 'height', 'auto');

            queueMicrotask(() => {
                let scrollHeight = element.scrollHeight;

                // 如果需要，减去 padding 以避免过高
                if (needsSubtractPadding) {
                    const paddingTop = parseInt(getComputedStyle(element).paddingTop, 10);
                    scrollHeight = Math.max(scrollHeight - paddingTop, this.rowHeight());
                } else {
                    scrollHeight = Math.max(scrollHeight, this.rowHeight());
                }

                const newHeight = Math.max(this.minHeight, Math.min(scrollHeight, ROW_HEIGHT_LEVELS.high));

                this.render2.setStyle(element, 'height', `${newHeight}px`);
                this.render2.setStyle(element, 'max-height', `${ROW_HEIGHT_LEVELS.high}px`);

                onHeightAdjusted?.();
            });
        }
    }
}
