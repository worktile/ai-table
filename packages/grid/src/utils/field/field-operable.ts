import { AITableField, AITableFilterCondition, AITableReferences, FieldBase, FieldOptions, FieldValue } from '@ai-table/utils';
import { AITable } from '../../core';

export interface FieldOperable<TFC = string, TCV extends FieldValue = FieldValue> extends FieldBase {
    isMeetFilter(condition: AITableFilterCondition<TFC>, cellValue: TCV, options?: FieldOptions): boolean;

    compare(
        cellValue1: TCV,
        cellValue2: TCV,
        references: AITableReferences,
        sortKey: string | undefined,
        options: { aiTable: AITable; field: AITableField }
    ): number;

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: TCV } | null,
        references?: AITableReferences,
        generator?: (text: string, cellValue: TCV) => TCV
    ): TCV | null;
}
