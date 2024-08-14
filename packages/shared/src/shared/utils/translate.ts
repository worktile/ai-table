import { AITableViewFields, AITableViewRecords, SharedType } from '../../types';

export const translateToRecordValues = (arrayRecord: any[], fields: AITableViewFields) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export const translateToRecords = (arrayRecords: any[], fields: AITableViewFields) => {
    return arrayRecords.map((record: any) => {
        const [nonEditableArray, editableArray] = record;
        return {
            _id: nonEditableArray[0],
            positions: editableArray[editableArray.length - 1],
            values: translateToRecordValues(editableArray.slice(0, editableArray.length - 1), fields)
        };
    });
};

export function translateIndexToIds(sharedType: SharedType, recordIndex: number, fieldIndex: number) {
    const data = sharedType.toJSON();
    const fields: AITableViewFields = data['fields'];
    const records: AITableViewRecords = translateToRecords(data['records'], fields);
    const recordId = records[recordIndex]._id;
    const fieldId = fields[fieldIndex]._id;
    return {
        recordId,
        fieldId
    };
}

export function translateIdsToIndex(sharedType: SharedType, recordId: string, fieldId: string) {
    const data = sharedType.toJSON();
    const fields: AITableViewFields = data['fields'];
    const records: AITableViewRecords = translateToRecords(data['records'], fields);
    const recordIndex = records.findIndex((item) => item._id === recordId);
    const fieldIndex = fields.findIndex((item) => item._id === fieldId);
    return {
        recordIndex,
        fieldIndex
    };
}
