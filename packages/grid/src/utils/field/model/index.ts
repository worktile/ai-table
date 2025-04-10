import { AITableFieldType } from '../../../core';
import { AttachmentField } from './attachment';
import { DateField } from './date';
import { Field } from './field';

import { LinkField } from './link';
import { MemberField } from './member';
import { NumberField } from './number';
import { ProgressField } from './progress';
import { RateField } from './rate';
import { RichTextField } from './rich-text';
import { SelectField } from './select';
import { TextField } from './text';

export const FieldModelMap: Record<AITableFieldType, Field> = {
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
    [AITableFieldType.attachment]: new AttachmentField()
};
