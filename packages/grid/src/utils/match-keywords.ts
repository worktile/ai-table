import { AITableField, AITableReferences } from '@ai-table/utils';
import { AITable, AITableQueries } from '../core';
import { transformCellValue } from './cell';
import { FieldModelMap } from './field';

export const isCellMatchKeywords = (
    aiTable: AITable,
    field: AITableField,
    recordId: string,
    keywords: string,
    references: AITableReferences
) => {
    const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, field._id]);
    const fieldMethod = FieldModelMap[field.type];
    if (fieldMethod.isValid(cellValue)) {
        const transformValue = fieldMethod.transformCellValue(cellValue, { aiTable, field });
        let cellFullText: string[] = fieldMethod.cellFullText(transformValue, field, references);
        return keywords && cellFullText.length && cellFullText.some((text) => text.toLowerCase().includes(keywords.toLowerCase()));
    } else {
        return false;
    }
};
