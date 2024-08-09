import { NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'text-cell-editor',
    template: `
        <textarea
            placeholder=""
            rows="1"
            thyInput
            [thyAutofocus]="true"
            [(ngModel)]="modelValue"
            (ngModelChange)="valueChange()"
            (thyEnter)="updateValue()"
            (blur)="updateValue()"
        ></textarea>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, FormsModule, ThyAutofocusDirective, ThyInputDirective, ThyEnterDirective],
    host: {
        class: 'text-cell-editor'
    }
})
export class TextCellEditorComponent extends AbstractEditCellEditor<string> implements AfterViewInit {
    private elementRef = inject(ElementRef);

    private render2 = inject(Renderer2);

    private maxHeight = 148;

    constructor() {
        super();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.updateStyle();
        });
    }

    updateStyle() {
        const textarea = this.elementRef.nativeElement.querySelector('textarea');
        // 4px = 上下边框高度
        const contentHeight = textarea.scrollHeight + 4;
        const height = contentHeight < this.maxHeight ? contentHeight : this.maxHeight;
        this.render2.setStyle(textarea, 'height', `${height}px`);
        this.render2.setStyle(textarea, 'min-height', `44px`);
        this.render2.setStyle(textarea, 'max-height', `${this.maxHeight}px`);
        this.render2.setStyle(textarea, 'resize', 'none');
    }

    valueChange() {
        this.updateStyle();
    }

    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }
}
