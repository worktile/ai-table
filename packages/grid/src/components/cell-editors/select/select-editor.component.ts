import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyEmptyModule } from 'ngx-tethys/empty';
import { ThySelect, ThySelectModule } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { AITableQueries, AITableSelectOptionStyle } from '../../../core';
import { AITableSelectField } from '../../../types';
import { SelectOptionComponent } from '../../cell-views/select/option.component';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyFormModule } from 'ngx-tethys/form';

@Component({
    selector: 'select-cell-editor',
    templateUrl: './select-editor.component.html',
    standalone: true,
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
export class SelectCellEditorComponent extends AbstractEditCellEditor<string[] | string, AITableSelectField> {
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
                return value[0];
            }
            return value || [];
        })();
    }

    onOpenChange(value: boolean) {
        if (!value) {
            this.closePopover();
        }
    }

    onModelChange(event: any) {
        this.updateValueFn();
    }

    updateValueFn() {
        const value = (this.isMultiple ? this.modelValue : (this.modelValue && ([this.modelValue] as string[])) || []) as string[];
        const originValue = AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]) as string[];
        if (!value.every((v, i) => v === originValue[i]) || value.length !== originValue.length) {
            this.updateFieldValue.emit({
                value: value,
                path: [this.record()._id, this.field()._id]
            });
        }
    }
}
