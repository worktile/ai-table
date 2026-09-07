import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, DestroyRef, ElementRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ThyPopoverModule, ThyPopoverRef, ThyPopover } from 'ngx-tethys/popover';
import { ThyInput, ThyInputDirective } from 'ngx-tethys/input';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyEnterDirective } from 'ngx-tethys/shared';
import { fromEvent, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import _ from 'lodash';

export interface FindResult {
    total: number;
    current: number;
    hasResults: boolean;
}

@Component({
    selector: 'app-find-popover',
    template: `
        <div class="find-popover">
            <div class="find-header">
                <span class="find-title">查找</span>
                <thy-icon thyIconName="close" class="close-icon" (click)="close()"></thy-icon>
            </div>

            <div class="find-content">
                <div class="find-input-section">
                    <thy-input
                        #findInput
                        [(ngModel)]="searchText"
                        (ngModelChange)="search($event)"
                        (thyEnter)="findNext()"
                        thyPlaceholder="输入查找内容"
                        class="find-input"
                        autofocus
                        thySize="lg"
                    >
                        <ng-template #append>
                            <span class="text-muted">{{ showIndex() }}/{{ findResult().total }}</span>
                        </ng-template>
                    </thy-input>
                </div>

                <div class="find-actions">
                    <button class="btn btn-outline-default btn-sm find-btn" [disabled]="buttonDisabled()" (click)="findPrevious()">
                        上一个
                    </button>
                    <button class="btn btn-outline-default btn-sm find-btn" [disabled]="buttonDisabled()" (click)="findNext()">
                        下一个
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .find-popover {
                width: 300px;
                padding: 0;
            }

            .find-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #e8e8e8;
            }

            .find-title {
                font-weight: 500;
                color: #333;
            }

            .find-content {
                padding: 16px;
            }

            .find-input-section {
                margin-bottom: 12px;
            }

            .find-label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                color: #666;
            }

            .find-input {
                width: 100%;
            }

            .find-results {
                margin-bottom: 12px;
                text-align: center;
            }

            .result-count {
                font-size: 12px;
                color: #999;
            }

            .find-actions {
                display: flex;
                gap: 8px;
                justify-content: center;
            }

            .find-btn {
                min-width: 80px;
            }
        `
    ],
    imports: [FormsModule, ThyPopoverModule, ThyInput, ThyButtonModule, ThyIconModule, ThyEnterDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FindPopoverComponent {
    searchText = signal('');

    findResult = signal<FindResult>({ total: 0, current: 0, hasResults: false });

    onSearch = output<string>();

    onFindNext = output<void>();

    onFindPrevious = output<void>();

    onClose = output<void>();

    private destroyRef = inject(DestroyRef);

    private popoverRef = inject(ThyPopoverRef<FindPopoverComponent>, { optional: true });

    private elementRef = inject(ElementRef);

    buttonDisabled = computed(() => {
        const result = this.findResult();
        return result.total === 0;
    });

    showIndex = computed(() => {
        return this.findResult().current;
    });

    constructor() {}

    search = _.debounce((keywords: string) => {
        return this.onSearchTextChange(keywords);
    }, 500);

    onSearchTextChange(keywords: string) {
        this.onSearch.emit(keywords);
    }

    findNext() {
        this.onFindNext.emit();
    }

    findPrevious() {
        this.onFindPrevious.emit();
    }

    close() {
        this.onClose.emit();
        if (this.popoverRef) {
            this.popoverRef.close();
        }
    }
}
