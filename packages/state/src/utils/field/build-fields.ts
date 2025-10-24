import { AITableView, AITableViewFields } from '@ai-table/utils';

export function buildViewFields(fields: AITableViewFields, activeView: AITableView): AITableViewFields {
    const activeViewId = activeView._id;
    return fields.map((field) => {
        const statType = field.stat_types?.[activeViewId];
        const width = field.widths?.[activeViewId];

        const newField = { ...field };

        if (statType) {
            newField.stat_type = statType;
        }

        if (width) {
            newField.width = width;
        }

        return newField;
    });
}
