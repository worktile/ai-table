import { AITable, AITableField, AttachmentFieldValue, FieldValue, AITableFieldType } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation, AITableReferences } from '../../../types';
import { isEmpty } from '../../common';
import { compareString, hasIntersect } from '../operate';
import { Field } from './field';

export class AttachmentField extends Field {
    override isValid(cellValue: FieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

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
        references: AITableReferences,
        sortKey: string,
        options: {
            aiTable: AITable;
            field: AITableField;
        }
    ): number {
        const value1 = cellValueToSortValue(cellValue1, options.field, references, sortKey);
        const value2 = cellValueToSortValue(cellValue2, options.field, references, sortKey);
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
    if (originData) {
        const { field, cellValue } = originData;
        if (field.type === AITableFieldType.attachment) {
            const attachmentIds = Object.keys(references?.attachments || {});
            const validAttachmentIds = cellValue.filter((id) => attachmentIds.includes(id));
            if (validAttachmentIds.length) {
                return validAttachmentIds;
            }
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
