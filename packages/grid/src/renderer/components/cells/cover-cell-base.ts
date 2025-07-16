import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AITableCoverCellConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';

@Component({
    selector: 'ai-table-cover-cell-base',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoverCellBase {
    static fieldType: AITableFieldType | string;

    config = input<AITableCoverCellConfig>();

    onlyDisplayBorder = input<boolean>(false);
}
