import { SharedType } from '../shared';

export const translateSharedTypeToTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const records = data['records'].map((record: any) => {
        let value: any = {};
        record.value.forEach((item: any) => {
            value[item.id] = item.fieldValue;
        });
        return {
            id: record.id,
            value: value
        };
    });
    const fields = data['fields'].map((item: any) => {
        const newField = {
            ...item,
            type: Number(item.type)
        };
        if (newField.options) {
            newField.options = Object.values(newField.options);
        }
        return newField;
    });

    return {
        records,
        fields
    };
};
