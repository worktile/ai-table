import { AITable, AITableField, AITableFieldType, FieldValue, RichTextFieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation, AITableReferences } from '../../../types';
import { transformCellValue } from '../../cell';
import { isEmpty } from '../../common';
import { compareString, isMeetFilter, stringInclude } from '../operate';
import { RichTextFieldBase } from '@ai-table/utils';
import { FieldOperable } from '../field-operable';

export class RichTextField extends RichTextFieldBase implements FieldOperable<string, RichTextFieldValue> {
    isMeetFilter(
        condition: AITableFilterCondition<string>,
        cellValue: RichTextFieldValue,
        options: {
            aiTable: AITable;
            field: AITableField;
        }
    ) {
        const textValue = transformCellValue(options.aiTable, options.field, cellValue || []);
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(textValue);
            case AITableFilterOperation.exists:
                return !isEmpty(textValue);
            case AITableFilterOperation.contain:
                return !isEmpty(textValue) && stringInclude(textValue, condition.value);
            default:
                return isMeetFilter(condition, textValue);
        }
    }

    compare(
        cellValue1: RichTextFieldValue,
        cellValue2: RichTextFieldValue,
        references: AITableReferences,
        sortKey: string,
        options: {
            aiTable: AITable;
            field: AITableField;
        }
    ): number {
        const value1 = transformCellValue(options.aiTable, options.field, cellValue1 || []);
        const value2 = transformCellValue(options.aiTable, options.field, cellValue2 || []);
        return compareString(value1, value2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        return toRichTextFieldValue(plainText, targetField, originData);
    }
}

export function toRichTextFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue }
): FieldValue | null {
    if (originData) {
        const { field, cellValue } = originData;
        if (field.type === AITableFieldType.richText) {
            return cellValue;
        }
    }

    return null;
}
