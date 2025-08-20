import { AITableQueries } from '@ai-table/grid';
import * as _ from 'lodash';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';
import { UpdateFieldValueOptions, AITableRecordUpdatedInfo, AITableSystemFieldValueOption, AITableViewFields } from '@ai-table/utils';
import { checkConditions } from './filter';

function updateWillHiddenRecordIds(
    aiTable: AIViewTable,
    needUpdateOptions: UpdateFieldValueOptions<unknown>[],
    updatedInfo?: AITableRecordUpdatedInfo
) {
    const willHiddenRecordIds: string[] = [];
    const removeWillHiddenRecordIds: string[] = [];
    needUpdateOptions.forEach((option) => {
        const [recordId, fieldId] = option.path;
        let record = _.cloneDeep(aiTable.recordsMap()[recordId]);
        record.values[fieldId] = option.value;
        if (updatedInfo) {
            record = {
                ...record,
                ...updatedInfo
            };
        }
        const checkResult = checkConditions(aiTable, aiTable.fields() as AITableViewFields, record);
        if (checkResult) {
            removeWillHiddenRecordIds.push(recordId);
        } else {
            willHiddenRecordIds.push(recordId);
        }
    });
    aiTable.recordsWillHidden.update((value) => {
        value = value.filter((id) => !removeWillHiddenRecordIds.includes(id));
        value.push(...willHiddenRecordIds);
        return value;
    });
}

export function updateFieldValues(aiTable: AIViewTable, options: UpdateFieldValueOptions[], updatedInfo?: AITableRecordUpdatedInfo) {
    const needUpdateOptions = options.filter((option) => {
        const oldValue = AITableQueries.getFieldValue(aiTable, option.path);
        return !_.isEqual(oldValue, option.value);
    });

    updateWillHiddenRecordIds(aiTable, needUpdateOptions, updatedInfo);

    Actions.updateFieldValues(aiTable, needUpdateOptions);

    if (updatedInfo) {
        const needUpdateSystemOptions: AITableSystemFieldValueOption[] = needUpdateOptions.map((option) => {
            return {
                path: [option.path[0]],
                updatedInfo: updatedInfo
            };
        });
        Actions.updateSystemFieldValues(aiTable, needUpdateSystemOptions);
    }
}
