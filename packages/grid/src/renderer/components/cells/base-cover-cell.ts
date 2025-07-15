import { AfterViewInit, ChangeDetectionStrategy, Component, input, ViewChild } from '@angular/core';
import { AITableCoverCellConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';
import { KoContainer } from '../../../angular-konva';

@Component({
    selector: 'ai-table-base-cover-cell',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseCoverCell extends Component implements AfterViewInit {
    static fieldType: AITableFieldType | string;

    config = input<AITableCoverCellConfig>();

    onlyDisplayBorder = input<boolean>(false);

    ngAfterViewInit() {}
}
