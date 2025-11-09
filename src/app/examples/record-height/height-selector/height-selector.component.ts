import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyAction } from 'ngx-tethys/action';
import { helpers } from 'ngx-tethys/util';
import { ThyIcon } from 'ngx-tethys/icon';
import {
    ThyDropdownDirective,
    ThyDropdownMenuComponent,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemNameDirective
} from 'ngx-tethys/dropdown';
import { AITableRecordHeightType } from '@ai-table/utils';

@Component({
    selector: 'app-record-height-selector',
    templateUrl: './height-selector.component.html',
    imports: [
        ThyIcon,
        ThyAction,
        FormsModule,
        ThyDropdownDirective,
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective
    ]
})
export class TableRecordHeightSelectorExample {
    readonly recordHeight = input<AITableRecordHeightType>(AITableRecordHeightType.low);

    readonly recordHeightChange = output<AITableRecordHeightType>();

    readonly recordHeights = [
        {
            label: '低',
            value: AITableRecordHeightType.low,
            icon: 'low'
        },
        {
            label: '中',
            value: AITableRecordHeightType.medium,
            icon: 'medium'
        },
        {
            label: '高',
            value: AITableRecordHeightType.high,
            icon: 'high'
        }
    ];

    readonly recordHeightsMap = helpers.keyBy(this.recordHeights, 'value');

    setRecordHeight(height: AITableRecordHeightType) {
        this.recordHeightChange.emit(height);
    }
}
