import { Component, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import { AITableFieldMenu } from '../../types/field';
import { AITableField, AITable } from '../../core';
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
    @Input() field!: AITableField;

    @Input() aiTable!: AITable;

    @Input() fieldMenus!: AITableFieldMenu[];

    @Input() origin!: HTMLElement | ElementRef<any>;

    execute(menu: AITableFieldMenu) {
        menu.exec(this.aiTable, this.field, this.origin);
    }
}
