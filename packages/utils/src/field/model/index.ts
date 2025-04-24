import { AITableFieldType } from '../../types';
import { AttachmentFieldBase } from './attachment';
import { DateFieldBase } from './date';
import { FieldBase } from './field';

import { LinkFieldBase } from './link';
import { MemberFieldBase } from './member';
import { NumberFieldBase } from './number';
import { ProgressFieldBase } from './progress';
import { RateFieldBase } from './rate';
import { RichTextFieldBase } from './rich-text';
import { SelectFieldBase } from './select';
import { TextFieldBase } from './text';

const FieldModelMap: Record<AITableFieldType, FieldBase> = {
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
export {
    FieldModelMap,
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
};
