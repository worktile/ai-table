import { isNil } from 'lodash';
import {
    AITableField,
    AITableFieldType,
    FieldValue,
    LinkFieldValue,
    LinkFieldBase,
    AITableFilterCondition,
    AITableFilterOperation,
    isEmpty
} from '@ai-table/utils';
import { extractText, extractLinkUrl } from '../../clipboard';
import { compareString, isMeetFilter, stringInclude } from '../operate';
import { FieldOperable } from '../field-operable';

export class LinkField extends LinkFieldBase implements FieldOperable<string, LinkFieldValue> {
    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: LinkFieldValue) {
        if (cellValue === null) {
            if (condition.operation === AITableFilterOperation.empty) {
                return true;
            } else {
                return false;
            }
        }
        const cellTextValue = cellValue?.text;
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellTextValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellTextValue);
            case AITableFilterOperation.contain:
                return !isNil(cellTextValue) && stringInclude(cellTextValue, condition.value);
            default:
                return isMeetFilter(condition, cellTextValue);
        }
    }

    compare(cellValue1: LinkFieldValue, cellValue2: LinkFieldValue): number {
        return compareString(cellValueToSortValue(cellValue1), cellValueToSortValue(cellValue2));
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue } | null
    ): FieldValue | null {
        return toLinkFieldValue(plainText, targetField, originData);
    }
}

export function toLinkFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue } | null
): FieldValue | null {
    if (originData) {
        const { field, cellValue } = originData;
        if (field.type === AITableFieldType.link) {
            return cellValue;
        }
    } else {
        const url = extractLinkUrl(plainText);
        const text = extractText(plainText);
        if (url && text) {
            return {
                url,
                text
            };
        }
    }
    return null;
}

function cellValueToSortValue(cellValue: LinkFieldValue): string | null {
    return (cellValue && cellValue.text && cellValue.text.trim()) || null;
}
