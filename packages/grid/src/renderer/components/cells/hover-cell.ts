import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { AITableHoverCellConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';

@Component({
    selector: 'ai-table-hover-cell',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoverCellComponent extends Component {
    static fieldType: AITableFieldType | string;

    config = input<AITableHoverCellConfig>();

    onlyExpandBorder = input<boolean>(false);
}
