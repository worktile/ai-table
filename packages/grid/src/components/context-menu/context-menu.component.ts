import { NgClass, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
    ThyDropdownAbstractMenu,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemNameDirective,
    ThyDropdownMenuItemIconDirective,
    ThyDropdownMenuItemMetaDirective
} from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyDivider } from 'ngx-tethys/divider';
import { AITable } from '../../core';
import { AITableContextMenuItem } from '../../types';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { ThyInputNumber } from 'ngx-tethys/input-number';
import { FormsModule } from '@angular/forms';
import { ThyEnterDirective, ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { ThyPopoverRef } from 'ngx-tethys/popover';
@Component({
    selector: 'ai-table-context-menu',
    templateUrl: './context-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'context-menu'
    },
    imports: [
        ThyInputNumber,
        FormsModule,
        ThyEnterDirective,
        ThyStopPropagationDirective,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective,
        ThyDropdownMenuItemIconDirective,
        ThyDropdownMenuItemMetaDirective,
        ThyIcon,
        NgClass,
        ThyDivider
    ]
})
export class AITableContextMenu extends ThyDropdownAbstractMenu {
    notifyService = inject(ThyNotifyService);

    thyPopoverRef = inject(ThyPopoverRef);

    aiTable = input.required<AITable>();

    menuItems = input.required<AITableContextMenuItem[]>();

    targetName = input.required<string>();

    position = input.required<{ x: number; y: number }>();

    maxCount = computed(() => this.aiTable().context?.maxRecords()! - this.aiTable().records().length);

    execute(menu: AITableContextMenuItem) {
        if ((menu.disabled && !menu.disabled(this.aiTable(), this.targetName(), this.position())) || !menu.disabled) {
            menu.exec && menu.exec(this.aiTable(), this.targetName(), this.position(), this.notifyService, menu.count);
        }
    }

    inputNumberFocus(e: Event) {
        (e.target as HTMLElement).focus();
    }

    itemEnterHandle(e: Event, menu: AITableContextMenuItem) {
        this.execute(menu);
        this.thyPopoverRef.close();
    }
}
