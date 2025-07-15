import { AfterViewInit, ChangeDetectionStrategy, Component, input, InputSignal, ViewChild } from '@angular/core';
import { AITableCoverCellConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';
import { KoContainer } from '../../../angular-konva';

@Component({
    selector: 'ai-table-cover-cell',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoverCellComponent extends Component implements AfterViewInit {
    parentContainer = input<KoContainer>();

    static fieldType: AITableFieldType | string;

    config = input<AITableCoverCellConfig>();

    onlyDisplayBorder = input<boolean>(false);

    @ViewChild('rootGroup') rootGroup: KoContainer | undefined;

    ngAfterViewInit() {
        if (this.parentContainer() && this.rootGroup) {
            this.rootGroup.getNode().moveTo(this.parentContainer()!.getNode());
        }
    }
}
