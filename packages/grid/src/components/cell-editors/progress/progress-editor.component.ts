import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
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
            (ngModelChange)="updateValue($event)"
        ></thy-slider>
        <span class="progress-text">{{ modelValue }}{{ config?.suffix || '%' }}</span>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThySlider],
    host: {
        class: 'progress-editor'
    }
})
export class ProgressEditorComponent extends AbstractEditCellEditor<number> implements OnInit {
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
        event.preventDefault();
    }

    constructor() {
        super();
    }

    updateValue(value: number) {
        this.updateFieldValue();
    }
}
