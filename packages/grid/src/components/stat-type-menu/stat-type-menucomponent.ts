import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ThyDropdownAbstractMenu, ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';
import { AITableField, AITableFieldStatTypeItemInfo, AITableStatType } from '@ai-table/utils';
import { AITable } from '../../core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ai-table-stat-type-menu',
    templateUrl: './stat-type-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'stat-type-menu'
    },
    imports: [ThyDropdownMenuItemDirective, NgClass]
})
export class AITableStatTypeMenu extends ThyDropdownAbstractMenu {
    field = input.required<AITableField>();

    aiTable = input.required<AITable>();

    statMenus = input.required<AITableFieldStatTypeItemInfo[]>();

    menuClick = output<{ menu: AITableFieldStatTypeItemInfo; field: AITableField }>();

    selectStatType = computed(() => this.field().stat_type || AITableStatType.None);

    execute(menu: AITableFieldStatTypeItemInfo) {
        this.menuClick.emit({
            menu,
            field: this.field()
        });
    }
}
