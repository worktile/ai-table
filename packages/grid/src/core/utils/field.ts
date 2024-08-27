import { FieldsMap, FieldsIncludeIsMultiple, Fields } from '../constants/field';
import { AITable, AITableField, AITableFieldType, IsMultiple } from '../types';
import { idCreator } from './id-creator';

export function getDefaultFieldValue(field: AITableField) {
    if ([AITableFieldType.select, AITableFieldType.member, AITableFieldType.createdBy, AITableFieldType.updatedBy].includes(field.type)) {
        return [];
    }
    return '';
}

export function createDefaultFieldName(aiTable: AITable, field: Partial<AITableField>) {
    if (!field.type) {
        return FieldsMap[AITableFieldType.text].name;
    }
    const isMultiple = FieldsIncludeIsMultiple.includes(field.type!) ? !!(field.settings as IsMultiple)?.is_multiple : false
    const fields = aiTable.fields();
    const count = fields.filter((item) => {
        return item.type === field.type && (!FieldsIncludeIsMultiple.includes(field.type) || !!(item.settings as IsMultiple)?.is_multiple === isMultiple);
    }).length;

    if (FieldsIncludeIsMultiple.includes(field.type!)) {
        const basicField = Fields.find(item => item.type === field.type && !!(item.settings as IsMultiple)?.is_multiple === isMultiple)!;
        return count === 0 ? basicField.name! : basicField.name! + ' ' + count;
    }
    return count === 0 ? FieldsMap[field.type!].name : FieldsMap[field.type!].name + ' ' + count;
}

export function createDefaultField(aiTable: AITable, type: AITableFieldType = AITableFieldType.text) {
    return { _id: idCreator(), type, name: createDefaultFieldName(aiTable, { type }) };
}
