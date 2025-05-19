import { NgClass, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
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
import { AITableGridSelectionService } from '../../services/selection.service';
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
    aiTableGridSelectionService = inject(AITableGridSelectionService);

    notifyService = inject(ThyNotifyService);

    thyPopoverRef = inject(ThyPopoverRef);

    aiTable = input.required<AITable>();

    menuItems = input.required<AITableContextMenuItem[]>();

    targetName = input.required<string>();

    position = input.required<{ x: number; y: number }>();

    execute(menu: AITableContextMenuItem) {
        if ((menu.disabled && !menu.disabled(this.aiTable(), this.targetName(), this.position())) || !menu.disabled) {
            menu.exec &&
                menu.exec(
                    this.aiTable(),
                    this.targetName(),
                    this.position(),
                    this.aiTableGridSelectionService,
                    this.notifyService,
                    menu.count
                );
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
