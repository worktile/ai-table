import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { AITableCoverCellConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';

@Component({
    selector: 'ai-table-cover-cell',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoverCellComponent extends Component {
    static fieldType: AITableFieldType | string;

    config = input<AITableCoverCellConfig>();

    onlyDisplayBorder = input<boolean>(false);
}
