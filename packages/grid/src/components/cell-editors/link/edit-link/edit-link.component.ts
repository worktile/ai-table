import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyButton } from 'ngx-tethys/button';
import {
    ThyFormDirective,
    ThyFormGroup,
    ThyFormGroupFooter,
    ThyFormModule,
    ThyFormSubmitDirective,
    ThyFormValidatorLoader
} from 'ngx-tethys/form';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyAutofocusDirective, ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { SafeAny } from 'ngx-tethys/types';

export const LINK_URL_REGEX = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;

/**
 * @private
 */
@Component({
    selector: 'link-edit',
    templateUrl: './edit-link.component.html',
    standalone: true,
    imports: [
        FormsModule,
        ThyStopPropagationDirective,
        ThyInputDirective,
        ThyAutofocusDirective,
        ThyButton,
        ThyFormSubmitDirective,
        ThyFormModule
    ]
})
export class LinkEditComponent implements OnInit {
    @Input() url = '';

    @Input() text = '';

    @Output() confirm = new EventEmitter<{ url: string; text: string }>();

    public URLRegex = LINK_URL_REGEX;

    validatorConfig = {
        validationMessages: {
            url: {
                pattern: '链接格式不正确'
            }
        }
    };

    constructor(public thyPopoverRef: ThyPopoverRef<SafeAny>) {}

    ngOnInit() {}

    close() {
        this.thyPopoverRef.close();
    }

    apply(form: ThyFormDirective) {
        if (this.text && !this.url) {
            form.validator.setElementErrorMessage('url', '链接不能为空');
            return;
        }

        this.close();
        const text = this.text.trim();
        const url = this.url.trim();
        const link = url ? { text: text || url, url: url } : undefined;
        this.confirm.emit(link);
    }
}
