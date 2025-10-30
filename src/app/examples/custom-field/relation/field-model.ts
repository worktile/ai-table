import {
    AITableFilterCondition,
    AITableFilterOperation,
    AITableReferences,
    AITableField,
    isEmpty,
    FieldBase,
    FieldOptions
} from '@ai-table/utils';
import { AITable, FieldOperable, hasIntersect, isMeetFilter } from '@ai-table/grid';
import { RelationFieldValue, RelationInfo, RELATION_FIELD_STAT_TYPE_ITEMS, AITableCustomReferences, RelationFieldType } from './types';

export class RelationField extends FieldBase implements FieldOperable<string, RelationFieldValue> {
    constructor() {
        super(RELATION_FIELD_STAT_TYPE_ITEMS);
    }

    isValid(cellValue: RelationFieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: RelationFieldValue, options?: FieldOptions) {
        if (options?.aiTable) {
            const references = options.aiTable.context.references();
            cellValue = cellValue?.filter((relationId) => references?.[options.field?.type ?? '']?.[relationId]);
        }
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
        cellValue1: RelationFieldValue,
        cellValue2: RelationFieldValue,
        references: AITableReferences,
        sortKey: string,
        options: {
            aiTable: AITable;
            field: AITableField;
        }
    ): number {
        return 0;
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: RelationFieldValue },
        references?: AITableReferences
    ): RelationFieldValue | null {
        if (targetField.type === originData?.field?.type && originData?.cellValue) {
            return originData.cellValue;
        }
        return null;
    }

    override cellFullText(transformValue: string[], field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (transformValue?.length && references) {
            for (let index = 0; index < transformValue.length; index++) {
                let relation: RelationInfo | undefined;
                if (field.type === RelationFieldType.relationTicket) {
                    relation = (references as AITableCustomReferences)?.[RelationFieldType.relationTicket]?.[transformValue[index]];
                }
                if (relation) {
                    const text = getRelationText(relation);
                    if (text !== '') {
                        fullText.push(text);
                    }
                }
            }
        }
        return fullText;
    }

    getDefaultValue() {
        return [];
    }
}

function getRelationText(relation: RelationInfo): string {
    let text = '';
    if (relation.whole_identifier) {
        text += relation.whole_identifier;
        text += ' ';
    }
    if (relation.title) {
        text += relation.title;
    }
    return text;
}
