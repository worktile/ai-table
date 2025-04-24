import { AITableFieldType } from '../types';
import {
    AttachmentFieldBase,
    DateFieldBase,
    FieldBase,
    LinkFieldBase,
    MemberFieldBase,
    NumberFieldBase,
    ProgressFieldBase,
    RateFieldBase,
    RichTextFieldBase,
    SelectFieldBase,
    TextFieldBase
} from './model';

export const FieldModelMap: Record<AITableFieldType, FieldBase> = {
    [AITableFieldType.text]: new TextFieldBase(),
    [AITableFieldType.richText]: new RichTextFieldBase(),
    [AITableFieldType.select]: new SelectFieldBase(),
    [AITableFieldType.date]: new DateFieldBase(),
    [AITableFieldType.createdAt]: new DateFieldBase(),
    [AITableFieldType.updatedAt]: new DateFieldBase(),
    [AITableFieldType.number]: new NumberFieldBase(),
    [AITableFieldType.rate]: new RateFieldBase(),
    [AITableFieldType.link]: new LinkFieldBase(),
    [AITableFieldType.member]: new MemberFieldBase(),
    [AITableFieldType.progress]: new ProgressFieldBase(),
    [AITableFieldType.createdBy]: new MemberFieldBase(),
    [AITableFieldType.updatedBy]: new MemberFieldBase(),
    [AITableFieldType.attachment]: new AttachmentFieldBase()
};
