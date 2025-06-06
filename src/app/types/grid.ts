import { AITableReferences } from '@ai-table/utils';
import { Dictionary } from 'lodash';

export interface AITableCustomReferences extends AITableReferences {
    relations?: Dictionary<any>;
}

export interface AITableCustomRelation {
    title: string;
    type: string;
    whole_identifier: string;
}
