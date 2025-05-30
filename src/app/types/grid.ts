import { AITableReferences } from '@ai-table/utils';
import { Dictionary } from 'lodash';

export interface AITableCustomReferences extends AITableReferences {
    relations?: Dictionary<any>;
}
