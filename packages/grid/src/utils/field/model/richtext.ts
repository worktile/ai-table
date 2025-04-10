import { AITable, AITableField, FieldValue, RichtextFieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation, AITableReferences } from '../../../types';
import { transformCellValue } from '../../cell';
import { isEmpty } from '../../common';
import { compareString, stringInclude } from '../operate';
import { Field } from './field';

export class RichtextField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: FieldValue, options: {
        aiTable: AITable;
        field: AITableField;
    }) {
        const textValue = transformCellValue(options.aiTable, options.field, cellValue || [])
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(textValue);
            case AITableFilterOperation.exists:
                return !isEmpty(textValue);
            case AITableFilterOperation.contain:
                return !isEmpty(textValue) && stringInclude(textValue, condition.value);
            default:
                return super.isMeetFilter(condition, textValue);
        }
    }

    override compare(
        cellValue1: RichtextFieldValue,
        cellValue2: RichtextFieldValue,
        field: AITableField,
        references: AITableReferences,
        sortKey: string,
        options: {
            aiTable: AITable;
            field: AITableField,
        }): number {
        const value1 = transformCellValue(options.aiTable, options.field, cellValue1 || [])
        const value2 = transformCellValue(options.aiTable, options.field, cellValue2 || [])
        return compareString(value1, value2);
    }

    override toFieldValue(plainText: string): FieldValue | null {
        return null;
    }

}




