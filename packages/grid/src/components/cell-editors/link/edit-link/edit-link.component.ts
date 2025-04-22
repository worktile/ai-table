import { Component, computed, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AITable } from '../../../../core/types/ai-table';
import { AITableGridI18nKey, getI18nTextByKey } from '../../../../utils/i18n';
import { ThyButton } from 'ngx-tethys/button';
import { ThyFormDirective, ThyFormModule, ThyFormSubmitDirective } from 'ngx-tethys/form';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { SafeAny } from 'ngx-tethys/types';

export const LINK_URL_REGEX = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;

/**
 * @private
 */
@Component({
    selector: 'link-edit',
    templateUrl: './edit-link.component.html',
    imports: [FormsModule, ThyStopPropagationDirective, ThyInputDirective, ThyButton, ThyFormSubmitDirective, ThyFormModule]
})
export class LinkEditComponent implements OnInit {
    @Input() url = '';

    @Input() text = '';

    aiTable = input<AITable>();

    @Output() confirm = new EventEmitter<{ url: string; text: string }>();

    public URLRegex = LINK_URL_REGEX;

    i18nTexts = computed(() => {
        return {
            linkText: getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.linkText),
            textPlaceholder: getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.inputText),
            urlLabel: getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.linkUrl),
            urlPlaceholder: getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.inputUrl),
            cancel: getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.cancel),
            apply: getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.apply)
        };
    });

    validatorConfig = computed(() => {
        return {
            validationMessages: {
                url: {
                    pattern: getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.invalidLinkFormat)
                }
            }
        };
    });

    constructor(public thyPopoverRef: ThyPopoverRef<SafeAny>) {}

    ngOnInit() {}

    close() {
        this.thyPopoverRef.close();
    }

    apply(form: ThyFormDirective) {
        if (this.text && !this.url) {
            form.validator.setElementErrorMessage('url', getI18nTextByKey(this.aiTable()!, AITableGridI18nKey.linkRequired));
            return;
        }

        this.close();
        const text = this.text.trim();
        const url = this.url.trim();
        const link = url ? { text: text || url, url: url } : undefined;
        this.confirm.emit(link);
    }
}
