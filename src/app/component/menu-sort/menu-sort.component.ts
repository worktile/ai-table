import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyCheckbox } from 'ngx-tethys/checkbox';
import { ThyDivider } from 'ngx-tethys/divider';
import { ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThySegmentItem } from 'ngx-tethys/segment';
import { AITableField } from '@ai-table/utils';
import { AITableFieldMenuItem } from '@ai-table/grid';

@Component({
    selector: 'checkbox-menu-sort',
    template: `
        <thy-icon class="sort-icon" [thyIconName]="menu().icon!"></thy-icon>
        <div class="sort-state">
            @if (menu().type === 'sortByAsc') {
                <label thyCheckbox [ngModel]="true" class="sort-checkbox"></label>
                <thy-icon thyIconName="arrow-right" class="mx-2"></thy-icon>
                <label thyCheckbox [ngModel]="false" class="sort-checkbox"></label>
            } @else {
                <label thyCheckbox [ngModel]="false" class="sort-checkbox"></label>
                <thy-icon thyIconName="arrow-right" class="mx-2"></thy-icon>
                <label thyCheckbox [ngModel]="true" class="sort-checkbox"></label>
            }
        </div>
    `,
    host: {
        class: 'checkbox-menu-sort'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThyIcon, ThyCheckbox, FormsModule, FormsModule]
})
export class CheckboxMenuSort implements OnInit {
    field = input.required<AITableField>();

    menu = input.required<AITableFieldMenuItem>();

    Direction = {
        ascending: 'ascending',
        descending: 'descending'
    };

    ngOnInit(): void {
        // throw new Error("Method not implemented.");
    }

    getSortText(): string {
        if (this.menu() && this.field()) {
            const menuName = this.menu()!.name;
            if (typeof menuName === 'function') {
                return menuName(this.field()!);
            }
            return menuName || '按 Z → A 排序';
        }
        return '按 Z → A 排序';
    }
}
