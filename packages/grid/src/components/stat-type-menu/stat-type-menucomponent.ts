import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    computed,
    input,
    output,
    signal
} from '@angular/core';
import { ThyDivider } from 'ngx-tethys/divider';
import { ThyDropdownAbstractMenu, ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITableField, AITableFieldStatTypeItemInfo } from '@ai-table/utils';
import { AITableFieldMenuItem } from '../../types/field';
import { AITable } from '../../core';

@Component({
    selector: 'ai-table-stat-type-menu',
    templateUrl: './stat-type-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'stat-type-menu'
    },
    imports: [ThyDropdownMenuItemDirective]
})
export class AITableStatTypeMenu extends ThyDropdownAbstractMenu {
    field = input.required<AITableField>();

    aiTable = input.required<AITable>();

    statMenus = input.required<AITableFieldStatTypeItemInfo[]>();

    menuClick = output<{ menu: AITableFieldStatTypeItemInfo; field: AITableField }>();

    execute(menu: AITableFieldStatTypeItemInfo) {
        this.menuClick.emit({
            menu,
            field: this.field()
        });
    }
}
