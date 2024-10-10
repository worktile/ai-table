import { UpdateFieldValueOptions } from '@ai-table/grid';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';

export function updateFieldValue(aiTable: AIViewTable, options: UpdateFieldValueOptions) {
    Actions.updateFieldValue(aiTable, options.value, options.path);
}
