import { AITableView, AITableViewFields } from '@ai-table/utils';

export function buildFieldStatType(data: AITableViewFields, activeView: AITableView) {
    return data.map((field, index) => {
        const fieldStatType = field.stat_types?.[activeView._id];
        if (fieldStatType) {
            return {
                ...field,
                stat_type: fieldStatType
            };
        } else {
            return field;
        }
    });
}
