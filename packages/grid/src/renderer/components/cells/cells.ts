import { Constructor } from 'ngx-tethys/core';
import { AITableFieldType } from '../../../core';
import { HoverCellComponent } from '../../interfaces';

import * as cellComponents from '.';

export const componentMap: Partial<Record<AITableFieldType, Constructor<HoverCellComponent>>> = {};

Object.values(cellComponents).forEach((cellComponent) => {
    componentMap[cellComponent.fieldType] = cellComponent;
});
