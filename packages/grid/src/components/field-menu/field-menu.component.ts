import { Component, ChangeDetectionStrategy, Input, ElementRef, Signal } from '@angular/core';
import { AITableFieldMenuItem } from '../../types/field';
import { AITable, AITableField } from '../../core';
import {
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemNameDirective,
    ThyDropdownMenuItemIconDirective,
    ThyDropdownMenuComponent
} from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyDivider } from 'ngx-tethys/divider';
import { getRecordOrField } from '../../utils';

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

    execute(menu: AITableFieldMenuItem) {
        const field = getRecordOrField(this.aiTable.fields, this.fieldId) as Signal<AITableField>;
        menu.exec && menu.exec(this.aiTable, field, this.origin);
    }
}
