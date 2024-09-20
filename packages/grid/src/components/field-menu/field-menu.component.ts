import { ChangeDetectionStrategy, Component, ElementRef, Input, Signal } from '@angular/core';
import { ThyDivider } from 'ngx-tethys/divider';
import {
    ThyDropdownAbstractMenu,
    ThyDropdownMenuComponent,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemIconDirective,
    ThyDropdownMenuItemNameDirective
} from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITable, AITableField } from '../../core';
import { AITableFieldMenuItem } from '../../types/field';
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
export class FieldMenu extends ThyDropdownAbstractMenu {
    @Input({ required: true }) fieldId!: string;

    @Input({ required: true }) aiTable!: AITable;

    @Input({ required: true }) fieldMenus!: AITableFieldMenuItem[];

    @Input() origin!: HTMLElement | ElementRef<any>;

    @Input() position!: { x: number; y: number };

    execute(menu: AITableFieldMenuItem) {
        const field = getRecordOrField(this.aiTable.fields, this.fieldId) as Signal<AITableField>;
        menu.exec && menu.exec(this.aiTable, field, this.origin, this.position);
    }
}
