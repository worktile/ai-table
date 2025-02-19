import { Component, EventEmitter, InputSignal } from '@angular/core';
import { AITableHoverCellConfig } from '../../types';
import { AITableFieldType } from '../../core';

export abstract class HoverCellComponent extends Component {
    static fieldType: AITableFieldType;
    config!: InputSignal<AITableHoverCellConfig | undefined>;
}
