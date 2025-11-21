import { AITableField, AITableFieldType, FieldModelBaseMap, SelectSettings } from '@ai-table/utils';
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
import {
    ColumnTextFilledPath,
    ColumnRichTextFilledPath,
    ColumnMultipleFillPath,
    ColumnSelectFilledPath,
    ColumnCalendarFilledPath,
    ColumnNumberFilledPath,
    ColumnLinkOutlinedPath,
    ColumnRatingFilledPath,
    ColumnMemberFilledPath,
    ColumnProgressFilledPath,
    AttachmentPath,
    ColumnCheckboxFilledPath
} from '../../constants/icon';

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

export function getFieldIconPath(field: AITableField) {
    let data: string | null = null;
    switch (field.type) {
        case AITableFieldType.text:
            data = ColumnTextFilledPath;
            break;
        case AITableFieldType.richText:
            data = ColumnRichTextFilledPath;
            break;
        case AITableFieldType.select:
            data = (field.settings as SelectSettings)?.is_multiple ? ColumnMultipleFillPath : ColumnSelectFilledPath;
            break;
        case AITableFieldType.date:
        case AITableFieldType.createdAt:
        case AITableFieldType.updatedAt:
            data = ColumnCalendarFilledPath;
            break;
        case AITableFieldType.number:
            data = ColumnNumberFilledPath;
            break;
        case AITableFieldType.link:
            data = ColumnLinkOutlinedPath;
            break;
        case AITableFieldType.rate:
            data = ColumnRatingFilledPath;
            break;
        case AITableFieldType.member:
        case AITableFieldType.createdBy:
        case AITableFieldType.updatedBy:
            data = ColumnMemberFilledPath;
            break;
        case AITableFieldType.progress:
            data = ColumnProgressFilledPath;
            break;
        case AITableFieldType.attachment:
            data = AttachmentPath;
            break;
        case AITableFieldType.checkbox:
            data = ColumnCheckboxFilledPath;
            break;
    }
    return data;
}
