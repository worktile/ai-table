import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyDot } from 'ngx-tethys/dot';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThySelect } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { SelectOptionPipe } from '../../../pipes';
import { AITableSelectOptionStyle, AITableSingleSelectField } from '../../../types';
import { SelectOptionComponent } from '../../cell-views/select/option.component';
import { SelectCellViewComponent } from '../../cell-views/select/select-view.component';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'single-select-cell-editor',
    templateUrl: './select-editor.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block h-100 select-cell-editor',
        '[class.tag]': 'field()!.optionStyle === AITableSelectOptionStyle.tag'
    },
    imports: [
        FormsModule,
        NgTemplateOutlet,
        ThySelect,
        ThyOption,
        ThyTag,
        ThyIcon,
        ThyTooltipModule,
        ThyDot,
        ThyFlexibleText,
        SelectOptionPipe,
        SelectCellViewComponent,
        SelectOptionComponent
    ]
})
export class SelectCellEditorComponent extends AbstractEditCellEditor<string, AITableSingleSelectField> {
    selectOptions = computed(() => {
        return this.field().options;
    });

    optionStyle = computed(() => {
        return (this.field() as AITableSingleSelectField).optionStyle || AITableSelectOptionStyle.tag;
    });

    AITableSelectOptionStyle = AITableSelectOptionStyle;

    constructor() {
        super();
    }

    updateValue(value: boolean) {
        if (!value) {
            this.updateFieldValue();
            this.closePopover();
        }
    }
}
