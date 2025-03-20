import { Id } from 'ngx-tethys/types';
import { AITableField, AITableFieldType, AttachmentFieldValue, FieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation, AITableReferences } from '../../../types';
import { isEmpty } from '../../common';
import { compareString, hasIntersect, stringInclude } from '../operate';
import { Field } from './field';

export class AttachmentField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: AttachmentFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.in:
                return Array.isArray(condition.value) && hasIntersect(cellValue, condition.value);
            case AITableFilterOperation.nin:
                return Array.isArray(condition.value) && !hasIntersect(cellValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(
        cellValue1: AttachmentFieldValue,
        cellValue2: AttachmentFieldValue,
        field: AITableField,
        references: AITableReferences,
        sortKey: string
    ): number {
        const value1 = cellValueToSortValue(cellValue1, field, references, sortKey);
        const value2 = cellValueToSortValue(cellValue2, field, references, sortKey);
        return compareString(value1, value2);
    }

    override cellFullText(transformValue: string[], field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (transformValue?.length && references) {
            for (let index = 0; index < transformValue.length; index++) {
                const attachmentInfo = references?.attachments[transformValue[index]];
                if (!attachmentInfo) {
                    continue;
                }
                if (attachmentInfo.title) {
                    fullText.push(attachmentInfo.title);
                }
            }
        }
        return fullText;
    }

    override toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: AttachmentFieldValue },
        references?: AITableReferences
    ): AttachmentFieldValue | null {
        return toAttachmentFieldValue(plainText, targetField, originData, references);
    }
}

export function toAttachmentFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: AttachmentFieldValue },
    references?: AITableReferences
): FieldValue | null {
    if (targetField.type == AITableFieldType.createdBy || targetField.type == AITableFieldType.updatedBy) {
        return null;
    }
    if (originData) {
        const { field, cellValue } = originData;
        switch (field.type) {
            case AITableFieldType.attachment:
                if (Array.isArray(cellValue) && cellValue.length) {
                    return cellValue;
                }
                break;
            default:
                break;
        }
    }

    plainText = plainText.trim();
    const hasAttachmentInfo = references && references.attachments && Object.keys(references.attachments).length;
    if (plainText && hasAttachmentInfo) {
        const attachmentTitles = plainText.split(',').map((id) => id.trim());
        const attachmentInfos = Object.values(references.attachments);
        let validAttachmentIds: AttachmentFieldValue = [];
        attachmentTitles.forEach((fileTitle) => {
            const attachmentInfo = attachmentInfos.find((attachment) => attachment.title === fileTitle);
            if (attachmentInfo) {
                validAttachmentIds.push(attachmentInfo._id as string);
            }
        });
        if (validAttachmentIds.length) {
            return validAttachmentIds;
        }
    }

    return null;
}

function cellValueToSortValue(
    cellValue: AttachmentFieldValue,
    field: AITableField,
    references: AITableReferences,
    sortKey = 'title'
): string | null {
    let values: string[] = [];
    if (cellValue?.length && references) {
        for (let index = 0; index < cellValue.length; index++) {
            const attachmentInfo = references?.attachments[cellValue[index]];
            if (!attachmentInfo) {
                continue;
            }

            const value = attachmentInfo[sortKey];
            if (value) {
                values.push(value);
            }
        }
    }
    return values && values.length ? values.join(', ') : null;
}
