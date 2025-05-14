import { Component, InputSignal } from '@angular/core';
import { AITableHoverCellConfig } from '../../types';
import { AITableFieldType } from '@ai-table/utils';

export abstract class HoverCellComponent extends Component {
    static fieldType: AITableFieldType;
    config!: InputSignal<AITableHoverCellConfig | undefined>;
}
