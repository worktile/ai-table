import { compareString, hasIntersect, isMeetFilter } from '../operate';
import {
    AITableFilterCondition,
    MemberFieldBase,
    AITableField,
    AITableFieldType,
    AITableReferences,
    FieldValue,
    MemberFieldValue,
    MemberSettings,
    AITableFilterOperation,
    Id
} from '@ai-table/utils';
import { FieldOperable } from '../field-operable';
import { isEmpty } from 'lodash';
import { AITable } from '../../../core';

export class MemberField extends MemberFieldBase implements FieldOperable<string, MemberFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: MemberFieldValue) {
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
        cellValue1: MemberFieldValue,
        cellValue2: MemberFieldValue,
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
        originData?: { field: AITableField; cellValue: FieldValue },
        references?: AITableReferences
    ): FieldValue | null {
        return toMemberFieldValue(plainText, targetField, originData, references);
    }
}

export function toMemberFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue },
    references?: AITableReferences
): FieldValue | null {
    if (targetField.type == AITableFieldType.createdBy || targetField.type == AITableFieldType.updatedBy) {
        return null;
    }

    const isMultiple = (targetField.settings as MemberSettings)?.is_multiple;
    if (originData) {
        const { field, cellValue } = originData;
        switch (field.type) {
            case AITableFieldType.member:
                if (Array.isArray(cellValue) && cellValue.length) {
                    return isMultiple ? cellValue : [cellValue[0]];
                }
                break;
            default:
                break;
        }
    }

    plainText = plainText.trim();
    const hasMemberInfo = references && references.members && Object.keys(references.members).length;
    if (plainText && hasMemberInfo) {
        const memberNames = plainText
            .split(',')
            .map((id) => id.trim())
            .filter((id) => !!id);
        const memberInfos = Object.values(references.members);
        let validMemberIds: MemberFieldValue = [];
        memberNames.forEach((memberName) => {
            const memberInfo = memberInfos.find((member) => member.display_name === memberName);
            if (memberInfo) {
                validMemberIds.push(memberInfo.uid as Id);
            }
        });
        if (validMemberIds.length) {
            return isMultiple ? validMemberIds : [validMemberIds[0]];
        }
    }

    return null;
}

function cellValueToSortValue(
    cellValue: MemberFieldValue,
    field: AITableField,
    references: AITableReferences,
    sortKey = 'display_name'
): string | null {
    let values: string[] = [];
    if (cellValue?.length && references) {
        for (let index = 0; index < cellValue.length; index++) {
            const userInfo = references?.members[cellValue[index]];
            if (!userInfo) {
                continue;
            }

            const value = userInfo[sortKey];
            if (value) {
                values.push(value);
            }
        }
    }
    return values && values.length ? values.join(', ') : null;
}
