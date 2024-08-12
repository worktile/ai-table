import { createDraft, finishDraft } from 'immer';
import { AITableFields, AITableFieldType, AITableRecords, FieldsMap } from '../core';
import { AITableGridData, AITableReferences } from '../types';

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields, references?: AITableReferences): AITableGridData => {
    const fields = fieldsValue.map((item) => {
        return {
            ...item,
            icon: item.icon || FieldsMap[item.type].icon,
            width: item.width || FieldsMap[item.type].width
        };
    });
    let records = buildRecordsByReferences(recordValue, fieldsValue, references);
    return {
        type: 'grid',
        fields,
        records
    };
};

export function buildRecordsByReferences(records: AITableRecords, fields: AITableFields, references?: AITableReferences) {
    if (!references) {
        return records;
    }
    if (!references.members) {
        return records;
    }
    const memberFields = fields.filter((field) =>
        [AITableFieldType.createdBy, AITableFieldType.updatedBy, AITableFieldType.member].includes(field.type)
    );
    if (memberFields.length) {
        const draftRecords = createDraft(records);
        draftRecords.forEach((record) => {
            memberFields.forEach((field) => {
                const value = record.values[field._id];
                record.values[field._id] = value.map((uid: string) => references.members[uid]).filter(Boolean);
            });
        });
        records = finishDraft(draftRecords);
    }
    return records;
}
