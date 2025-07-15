import { Constructor } from 'ngx-tethys/core';
import { AITableFieldType } from '@ai-table/utils';

import * as cellComponents from '.';
import { BaseCoverCell } from './base-cover-cell';

export const ComponentMap: Partial<Record<AITableFieldType | string, Constructor<BaseCoverCell>>> = {};

Object.values(cellComponents).forEach((cellComponent) => {
    ComponentMap[cellComponent.fieldType] = cellComponent;
});
