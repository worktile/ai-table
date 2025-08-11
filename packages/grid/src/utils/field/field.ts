import { AITableFieldType, FieldModelBaseMap } from '@ai-table/utils';
import { FieldOperable } from './field-operable';
import {
    AITable,
    AttachmentField,
    DateField,
    LinkField,
    MemberField,
    NumberField,
    ProgressField,
    RateField,
    RichTextField,
    SelectField,
    TextField
} from './model';
import { CheckboxField } from './model/checkbox';

export const FieldModelMap: Record<AITableFieldType | string, FieldOperable<unknown, unknown>> = {
    ...FieldModelBaseMap,
    [AITableFieldType.text]: new TextField(),
    [AITableFieldType.richText]: new RichTextField(),
    [AITableFieldType.select]: new SelectField(),
    [AITableFieldType.date]: new DateField(),
    [AITableFieldType.createdAt]: new DateField(),
    [AITableFieldType.updatedAt]: new DateField(),
    [AITableFieldType.number]: new NumberField(),
    [AITableFieldType.rate]: new RateField(),
    [AITableFieldType.link]: new LinkField(),
    [AITableFieldType.member]: new MemberField(),
    [AITableFieldType.progress]: new ProgressField(),
    [AITableFieldType.createdBy]: new MemberField(),
    [AITableFieldType.updatedBy]: new MemberField(),
    [AITableFieldType.attachment]: new AttachmentField(),
    [AITableFieldType.checkbox]: new CheckboxField()
};

export function selectField(aiTable: AITable, fieldId: string) {
    if (aiTable.selection().selectedFields.has(fieldId)) {
        return;
    }
    aiTable.selection.set({
        selectedRecords: new Set(),
        selectedFields: new Set([fieldId]),
        selectedCells: new Set(),
        activeCell: null,
        selectedEndCell: null
    });
}
