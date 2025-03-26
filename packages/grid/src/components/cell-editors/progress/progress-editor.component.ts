import { ChangeDetectionStrategy, Component, HostListener, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThySlider, ThySliderSize, ThySliderType } from 'ngx-tethys/slider';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

export interface AITableProgressConfig {
    max?: number;
    min?: number;
    step?: number;
    progressType?: ThySliderType;
    suffix?: string;
    size?: ThySliderSize;
}

@Component({
    selector: 'progress-editor',
    template: `
        <thy-slider
            [(ngModel)]="modelValue"
            [thyMax]="config?.max || 100"
            [thyMin]="config?.min || 0"
            [thyStep]="config?.step || 1"
            [thyType]="config?.progressType || 'success'"
            [thySize]="config?.size || 'md'"
            (ngModelChange)="update()"
            (mousedown)="sliderMousedownHandler($event)"
        ></thy-slider>
        <span class="progress-text">{{ modelValue }}{{ config?.suffix || '%' }}</span>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThySlider],
    host: {
        class: 'grid-cell progress-editor ai-table-prevent-clear-selection',
        '[attr.type]': 'field().type',
        '[attr.fieldId]': 'field()._id',
        '[attr.recordId]': 'record()._id'
    }
})
export class ProgressEditorComponent extends AbstractEditCellEditor<number> {
    mousedownCell = input<(isSelectCell: boolean) => void>();

    config: Partial<AITableProgressConfig | undefined> = {
        max: 100,
        min: 0,
        step: 1,
        progressType: 'success',
        suffix: '%',
        size: 'md'
    };

    @HostListener('mousedown', ['$event'])
    mousedownHandler(event: Event) {
        this.handleMousedownCell(true);
        event.preventDefault();
    }

    sliderMousedownHandler(event: Event) {
        this.handleMousedownCell(false);
        event.preventDefault();
        event.stopPropagation();
    }

    handleMousedownCell(isSelectCell: boolean) {
        const mousedownCellFn = this.mousedownCell && this.mousedownCell();
        if (mousedownCellFn) {
            mousedownCellFn(isSelectCell);
        }
    }
}
