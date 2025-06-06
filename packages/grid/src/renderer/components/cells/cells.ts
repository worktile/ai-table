import { Constructor } from 'ngx-tethys/core';
import { AITableFieldType } from '@ai-table/utils';

import * as cellComponents from '.';
import { HoverCellComponent } from './hover-cell';

export const ComponentMap: Partial<Record<AITableFieldType | string, Constructor<HoverCellComponent>>> = {};

Object.values(cellComponents).forEach((cellComponent) => {
    ComponentMap[cellComponent.fieldType] = cellComponent;
});
