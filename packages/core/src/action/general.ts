import { ActionName, VTable, VTableAction, VTableValue } from '../types';
import { createDraft, finishDraft } from 'immer';

const apply = (value: VTableValue, options: VTableAction) => {
    switch (options.type) {
        case ActionName.UpdateFieldValue: {
            const [recordIndex, fieldIndex] = options.path;
            const fieldId = value.fields[fieldIndex].id;
            value.records[recordIndex].value[fieldId] = options.newProperties.value;
            break;
        }

        case ActionName.AddRecord: {
            const [recordIndex] = options.path;
            value.records.splice(recordIndex, 0, options.record);
            break;
        }
    }
};

export const GeneralActions = {
    transform(vTable: VTable, op: VTableAction): void {
        const data = createDraft(vTable.value());
        try {
            apply(data, op);
        } finally {
            vTable.value.update(() => {
                const value = finishDraft(data);
                return value;
            });
        }
    }
};
