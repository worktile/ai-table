import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ROW_HEIGHT_LEVELS } from '../../../constants';

@Component({
    selector: 'text-cell-editor',
    template: `
        <textarea
            #textarea
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyAutofocusDirective, ThyInputDirective, ThyEnterDirective],
    host: {
        class: 'text-cell-editor'
    }
})
export class TextCellEditorComponent extends AbstractEditCellEditor<string> implements AfterViewInit {
    private render2 = inject(Renderer2);

    private minHeight = 24;

    isSelectAll = input(false);

    constructor() {
        super();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.updateStyle();
            this.handleSelectAll();
        }, 0);
    }

    updateStyle() {
        const textarea = this.elementRef.nativeElement.querySelector('textarea');
        if (textarea) {
            this.render2.setStyle(textarea, 'height', 'auto');
            const scrollHeight = Math.max(textarea.scrollHeight, this.rowHeight());
            const newHeight = Math.max(this.minHeight, Math.min(scrollHeight, ROW_HEIGHT_LEVELS.high)) + 4;

            this.render2.setStyle(textarea, 'max-height', `${ROW_HEIGHT_LEVELS.high}px`);
            this.render2.setStyle(textarea, 'height', `${newHeight}px`);
            this.render2.setStyle(textarea, 'resize', 'none');
        }
    }

    handleSelectAll() {
        if (this.isSelectAll()) {
            const textarea = this.elementRef.nativeElement.querySelector('textarea')!;
            textarea.select();
        }
    }

    valueChange() {
        this.updateStyle();
    }

    updateValue() {
        super.update();
        this.closePopover();
    }
}
