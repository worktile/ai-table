import { AITableQueries } from '@ai-table/grid';
import * as _ from 'lodash';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';
import { UpdateFieldValueOptions, AITableRecordUpdatedInfo, AITableSystemFieldValueOption, AITableViewFields } from '@ai-table/utils';
import { checkConditions } from './filter';

export function updateFieldValues(aiTable: AIViewTable, options: UpdateFieldValueOptions[], updatedInfo?: AITableRecordUpdatedInfo) {
    const needUpdateOptions = options.filter((option) => {
        const oldValue = AITableQueries.getFieldValue(aiTable, option.path);
        return !_.isEqual(oldValue, option.value);
    });

    const hiddenRecordIds: string[] = [];
    const removeHiddenRecordIds: string[] = [];
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
        if (!checkResult) {
            hiddenRecordIds.push(recordId);
        } else {
            removeHiddenRecordIds.push(recordId);
        }
    });
    aiTable.recordsWillHidden.update((value) => {
        value = value.filter((id) => !removeHiddenRecordIds.includes(id));
        value.push(...hiddenRecordIds);
        return value;
    });

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
