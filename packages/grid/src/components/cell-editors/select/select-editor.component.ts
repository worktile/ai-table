import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyEmptyModule } from 'ngx-tethys/empty';
import { ThySelect, ThySelectModule } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { AITableSelectOptionStyle } from '@ai-table/utils';
import { AITableSelectField } from '../../../types';
import { SelectOptionComponent } from '../../cell-views/select/option.component';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyFormModule } from 'ngx-tethys/form';
import { AITableQueries } from '../../../core';
import { ROW_HEIGHT_LEVELS } from '../../../constants';

@Component({
    selector: 'select-cell-editor',
    templateUrl: './select-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block h-100 select-cell-editor'
    },
    imports: [
        ThySelect,
        ThyOption,
        ThyTooltipModule,
        SelectOptionComponent,
        CommonModule,
        ThyEmptyModule,
        ThyFormModule,
        FormsModule,
        ThySelectModule
    ]
})
export class SelectCellEditorComponent extends AbstractEditCellEditor<string[] | string, AITableSelectField> implements AfterViewInit {
    selectOptions = computed(() => {
        return this.field().settings.options;
    });

    preset = computed(() => {
        return this.field().settings.is_multiple && this.field().settings.option_style === AITableSelectOptionStyle.tag ? 'tag' : '';
    });

    get isMultiple() {
        return !!this.field().settings.is_multiple;
    }

    constructor() {
        super();
    }

    override ngOnInit(): void {
        this.modelValue = computed(() => {
            const value = AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
            if (!this.isMultiple) {
                return value?.length > 0 ? value[0] : null;
            }
            return value || [];
        })();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.updateStyle();
        });
    }

    onOpenChange(value: boolean) {
        if (!value) {
            this.closePopover();
        }
    }

    onModelChange(event: any) {
        this.updateValueFn();
        setTimeout(() => {
            this.updateStyle();
        });
    }

    updateValueFn() {
        const value = (this.isMultiple ? this.modelValue : (this.modelValue && ([this.modelValue] as string[])) || []) as string[];
        const originValue = AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]) || [];
        if (value.length !== originValue.length || !value.every((v, i) => v === originValue[i])) {
            this.updateFieldValues.emit([
                {
                    value: value,
                    path: [this.record()._id, this.field()._id]
                }
            ]);
        }
    }

    updateStyle() {
        this.adjustElementHeight('.form-control', true, () => {
            this.thyPopoverRef?.updatePosition();
        });
    }
}
