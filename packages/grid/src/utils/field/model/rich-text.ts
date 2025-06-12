import {
    AITableField,
    AITableFieldType,
    AITableFilterCondition,
    AITableFilterOperation,
    AITableReferences,
    FieldOptions,
    FieldValue,
    RichTextFieldValue,
    RichTextFieldBase,
    isEmpty
} from '@ai-table/utils';
import { transformToCellText } from '../../cell';
import { compareString, isMeetFilter, stringInclude } from '../operate';
import { FieldOperable } from '../field-operable';

export class RichTextField extends RichTextFieldBase implements FieldOperable<string, RichTextFieldValue> {
    override transformCellValue(cellValue: FieldValue, options: FieldOptions) {
        return transformToCellText(cellValue, options);
    }

    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: RichTextFieldValue, options: FieldOptions) {
        const textValue = this.transformCellValue(cellValue || [], options);
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
        options: FieldOptions
    ): number {
        const value1 = this.transformCellValue(cellValue1 || [], options);
        const value2 = this.transformCellValue(cellValue2 || [], options);
        return compareString(value1, value2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue },
        references?: AITableReferences,
        generator?: (text: string, cellValue: FieldValue) => RichTextFieldValue
    ): FieldValue | null {
        return toRichTextFieldValue(plainText, targetField, originData, generator);
    }
}

export function toRichTextFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue } | null,
    generator?: (text: string, cellValue: FieldValue) => FieldValue
): RichTextFieldValue | null {
    if (originData) {
        const { field, cellValue } = originData;
        if (field.type === AITableFieldType.richText) {
            return cellValue;
        }
    }

    if (plainText && generator) {
        return generator(plainText, originData?.cellValue);
    }

    return null;
}
