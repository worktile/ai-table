import { ChangeDetectionStrategy, Component, ElementRef, Input, computed } from '@angular/core';
import { ThyDivider } from 'ngx-tethys/divider';
import { ThyDropdownAbstractMenu, ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITableField } from '@ai-table/utils';
import { AITableFieldMenuItem } from '../../types/field';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { AITable } from '../../core';

@Component({
    selector: 'ai-table-field-menu',
    templateUrl: './field-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'field-menu'
    },
    imports: [ThyIcon, ThyDivider, ThyDropdownMenuItemDirective, NgClass, NgComponentOutlet]
})
export class AITableFieldMenu extends ThyDropdownAbstractMenu {
    @Input({ required: true }) fieldId!: string;

    @Input({ required: true }) aiTable!: AITable;

    @Input({ required: true }) fieldMenus!: AITableFieldMenuItem[];

    @Input() origin!: HTMLElement | ElementRef<any>;

    @Input() position!: { x: number; y: number };

    field = computed(() => {
        return this.aiTable.fields().find((item) => item._id === this.fieldId)!;
    });

    getCustomComponent(menu: AITableFieldMenuItem) {
        return menu.customComponent?.(this.aiTable, this.field()!);
    }
    execute(menu: AITableFieldMenuItem) {
        if ((menu.disabled && !menu.disabled(this.aiTable, this.field)) || !menu.disabled) {
            menu.exec && menu.exec(this.aiTable, this.field, this.origin, this.position);
        }
    }

    getMenuName(menu: AITableFieldMenuItem, field: AITableField): string {
        if (typeof menu.name === 'function') {
            return menu.name(field);
        }
        return menu.name || '';
    }
}
