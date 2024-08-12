import { FieldsMap } from '../constants/field';
import { AITable, AITableField, AITableFieldType } from '../types';
import { idCreator } from './id-creator';

export function getDefaultFieldValue(field: AITableField) {
    if ([AITableFieldType.select, AITableFieldType.member, AITableFieldType.createdBy, AITableFieldType.updatedBy].includes(field.type)) {
        return [];
    }
    return '';
}

export function createDefaultFieldName(aiTable: AITable, type: AITableFieldType = AITableFieldType.text) {
    const fields = aiTable.fields();
    const count = fields.filter((item) => item.type === type).length;
    return count === 0 ? FieldsMap[type].name : FieldsMap[type].name + ' ' + count;
}

export function createDefaultField(aiTable: AITable, type: AITableFieldType = AITableFieldType.text) {
    return { _id: idCreator(), type, name: createDefaultFieldName(aiTable, type) };
}
