import { ActionName, AITable, AITableAction, AITableFields, AITableRecords } from '../types';
import { createDraft, finishDraft } from 'immer';
import { addRecordFn, updateFieldValueFn } from './record';
import { addFieldFn } from './field';

export const defaultMethods: any = {
    [ActionName.UpdateFieldValue]: updateFieldValueFn,
    [ActionName.AddField]: addFieldFn,
    [ActionName.AddRecord]: addRecordFn
};

export const mergeMethods = (customMethods?: {}) => {
    return { ...defaultMethods, ...customMethods };
};

const apply = (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: AITableAction, aiCustomAction = {}) => {
    const allMethods = mergeMethods(aiCustomAction);
    const func = allMethods[options.type];
    func(aiTable, records, fields, options);
    return {
        records,
        fields
    };
};

export const GeneralActions = {
    transform(aiTable: AITable, op: AITableAction, aiCustomAction = {}): void {
        const records = createDraft(aiTable.records());
        const fields = createDraft(aiTable.fields());
        apply(aiTable, records, fields, op, aiCustomAction);
        aiTable.fields.update(() => {
            return finishDraft(fields);
        });
        aiTable.records.update(() => {
            return finishDraft(records);
        });
    }
};
