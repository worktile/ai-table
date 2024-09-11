import { Component, ChangeDetectionStrategy, Input, ElementRef, computed } from '@angular/core';
import { AITableFieldMenuItem } from '../../types/field';
import { AITable } from '../../core';
import {
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemNameDirective,
    ThyDropdownMenuItemIconDirective,
    ThyDropdownMenuComponent
} from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyDivider } from 'ngx-tethys/divider';

@Component({
    selector: 'field-menu',
    templateUrl: './field-menu.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ThyIcon,
        ThyDivider,
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective,
        ThyDropdownMenuItemIconDirective
    ]
})
export class FieldMenu {
    @Input({ required: true }) fieldId!: string;

    @Input({ required: true }) aiTable!: AITable;

    @Input({ required: true }) fieldMenus!: AITableFieldMenuItem[];

    @Input() origin!: HTMLElement | ElementRef<any>;

    field = computed(() => {
        return this.aiTable.fields().find((item) => item._id === this.fieldId)!;
    });

    execute(menu: AITableFieldMenuItem) {
        if ((menu.disabled && !menu.disabled(this.aiTable, this.field)) || !menu.disabled) {
            menu.exec && menu.exec(this.aiTable, this.field, this.origin);
        }
    }
}
