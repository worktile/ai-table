import { Constructor } from 'ngx-tethys/core';
import { AITableFieldType } from '@ai-table/utils';

import * as cellComponents from '.';
import { CoverCellBase } from './cover-cell-base';

export const ComponentMap: Partial<Record<AITableFieldType | string, Constructor<CoverCellBase>>> = {};

Object.values(cellComponents).forEach((cellComponent) => {
    ComponentMap[cellComponent.fieldType] = cellComponent;
});
