import { ChangeDetectionStrategy, Component, computed, effect, input, untracked } from '@angular/core';
import { AITableCoverCellConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';
import { setExpandCellInfo } from '../../../utils';

@Component({
    selector: 'ai-table-cover-cell-base',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoverCellBase {
    static fieldType: AITableFieldType | string;

    config = input<AITableCoverCellConfig>();

    onlyDisplayBorder = input<boolean>(false);

    isExpand = computed(() => {
        const { isExpand } = this.config()!;
        return isExpand;
    });
}
