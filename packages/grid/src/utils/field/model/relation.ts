import {
    AITableFilterCondition,
    AITableFilterOperation,
    AITableReferences,
    AttachmentFieldBase,
    AITableField,
    AttachmentFieldValue,
    FieldValue,
    AITableFieldType,
    isEmpty,
    RelationFieldBase
} from '@ai-table/utils';
import { AITable } from '../../../core';
import { compareString, hasIntersect, isMeetFilter } from '../operate';
import { FieldOperable } from '../field-operable';

export class RelationField extends RelationFieldBase implements FieldOperable<string, AttachmentFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: AttachmentFieldValue) {
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
                return isMeetFilter(condition, cellValue);
        }
    }

    compare(
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

    toFieldValue(
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
            const validAttachmentIds = (cellValue || []).filter((id) => attachmentIds.includes(id));
            if (validAttachmentIds.length > 0) {
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
