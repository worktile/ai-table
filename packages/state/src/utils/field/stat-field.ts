import { AITableView, AITableViewFields } from '@ai-table/utils';

export function buildFieldStatType(data: AITableViewFields, activeView: AITableView) {
    data.forEach((field, index) => {
        const fieldStatType = field.fieldStatTypes?.[activeView._id];
        if (fieldStatType) {
            data[index] = {
                ...field,
                stat_type: fieldStatType
            };
        }
    });
}
