import { AITableField, AITableFieldType, FieldValue, LinkFieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { extractText, extractLinkUrl } from '../../clipboard';
import { isEmpty } from '../../common';
import { compareString, stringInclude } from '../operate';
import { Field } from './field';

export const isLinkValid = (cellValue: FieldValue): cellValue is LinkFieldValue => {
    return (cellValue && typeof cellValue === 'object' && 'url' in cellValue && 'text' in cellValue) || cellValue === null;
};

export class LinkField extends Field {
    override isValid(cellValue: FieldValue): boolean {
        return isLinkValid(cellValue);
    }

    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: LinkFieldValue) {
        if (!isLinkValid(cellValue) || cellValue === null) {
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
                return !isEmpty(cellTextValue) && stringInclude(cellTextValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellTextValue);
        }
    }

    override compare(cellValue1: LinkFieldValue, cellValue2: LinkFieldValue): number {
        return compareString(cellValueToSortValue(cellValue1), cellValueToSortValue(cellValue2));
    }

    override cellFullText(transformValue: LinkFieldValue): string[] {
        let texts: string[] = [];
        if (isLinkValid(transformValue) && transformValue !== null) {
            texts.push(transformValue.text);
        }
        return texts;
    }

    override toFieldValue(
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
