import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'text-cell-editor',
    template: `
        <textarea
            #textarea
            placeholder=""
            rows="1"
            thyInput
            [thyAutofocus]="autoFocus()"
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
    isSelectAll = input(false);

    constructor() {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.applyContainerClass('has-text-cell');
    }

    ngAfterViewInit() {
        // 解决闪烁线问题
        queueMicrotask(() => {
            this.updateStyle();
            this.handleSelectAll();
        });
    }

    updateStyle() {
        this.adjustElementHeight('textarea', true);
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
