import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyInputGroup, ThyInputModule } from 'ngx-tethys/input';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyAction } from 'ngx-tethys/action';
import { ThyFlexibleTextModule } from 'ngx-tethys/flexible-text';
import { ThyPopover } from 'ngx-tethys/popover';
import { LINK_URL_REGEX, LinkEditComponent } from './edit-link/edit-link.component';
import * as _ from 'lodash';
import { ThyNotifyService } from 'ngx-tethys/notify';

@Component({
    selector: 'link-cell-editor',
    templateUrl: `./link-editor.component.html`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ThyAutofocusDirective,
        ThyEnterDirective,
        ThyInputGroup,
        ThyTooltipModule,
        ThyAction,
        ThyInputModule,
        ThyFlexibleTextModule,
        LinkEditComponent
    ],
    host: {
        class: 'ai-table-link-editor'
    }
})
export class LinkCellEditorComponent extends AbstractEditCellEditor<{ text: string; url: string }> implements OnInit {
    @ViewChild('inputElement', { static: false })
    inputElement!: ElementRef;

    elementRef = inject(ElementRef);

    text = '';

    url = '';

    originValue = {};

    thyPopover = inject(ThyPopover);

    cdr = inject(ChangeDetectorRef);

    notifyService = inject(ThyNotifyService);

    disabled = false;

    isOpened = false;

    isValidLink(link: { text: string; url: string }) {
        if (!link?.text?.trim()) {
            return true;
        }
        if (!link.url) {
            return LINK_URL_REGEX.test(link.text);
        }
        return true;
    }

    createLinkValue(link: { text: string; url: string }) {
        const text = link?.text?.trim();
        if (!text) {
            return { url: '', text: '' };
        } else {
            const url = link.url?.trim();
            return { url: url || text, text: text || url };
        }
    }

    public blur(event: FocusEvent) {
        const action = this.elementRef.nativeElement.querySelector('.edit-icon');
        if (!(event.relatedTarget as HTMLElement)?.contains(action)) {
            this.updateValue();
        }
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.originValue = this.modelValue;
        this.text = this.modelValue.text ?? '';
        this.url = this.modelValue.url ?? '';
    }

    updateValue() {
        if (!this.isValidLink({ text: this.text, url: this.url ?? '' })) {
            this.notifyService.error(undefined, '链接格式不正确');
            return;
        }
        this.modelValue = this.createLinkValue({ text: this.text, url: this.url ?? '' });
        if (!_.isEqual(this.originValue, this.modelValue)) {
            this.updateFieldValue();
            this.originValue = this.modelValue;
        }
    }

    openEdit() {
        this.isOpened = true;
        const popoverRef = this.thyPopover.open(LinkEditComponent, {
            origin: this.elementRef.nativeElement,
            originActiveClass: 'editing',
            placement: 'bottomLeft',
            minWidth: '320px',
            width: this.elementRef.nativeElement.clientWidth + 'px',
            initialState: {
                url: this.url ?? '',
                text: this.text ?? ''
            }
        });

        if (popoverRef) {
            popoverRef.componentInstance.confirm.subscribe((value: { url: string; text: string }) => {
                this.text = value.text;
                this.url = value.url;
                this.updateValue();
            });

            popoverRef.beforeClosed().subscribe(() => {
                this.isOpened = false;
                this.cdr.markForCheck();
            });
        }
    }
}
