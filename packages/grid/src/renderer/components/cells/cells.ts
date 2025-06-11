import { Constructor } from 'ngx-tethys/core';
import { AITableFieldType } from '@ai-table/utils';

import * as cellComponents from '.';
import { CoverCellComponent } from './cover-cell';

export const ComponentMap: Partial<Record<AITableFieldType | string, Constructor<CoverCellComponent>>> = {};

Object.values(cellComponents).forEach((cellComponent) => {
    ComponentMap[cellComponent.fieldType] = cellComponent;
});
