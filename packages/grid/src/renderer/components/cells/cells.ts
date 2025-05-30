import { Constructor } from 'ngx-tethys/core';
import { AITableFieldType } from '@ai-table/utils';
import { HoverCellComponent } from '../../interfaces';

import * as cellComponents from '.';

export const ComponentMap: Partial<Record<AITableFieldType | string, Constructor<HoverCellComponent>>> = {};

Object.values(cellComponents).forEach((cellComponent) => {
    ComponentMap[cellComponent.fieldType] = cellComponent;
});
