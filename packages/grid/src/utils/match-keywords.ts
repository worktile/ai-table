import { AITable, AITableField, AITableQueries } from '../core';
import { AITableReferences } from '../types';
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
        const transformValue = transformCellValue(aiTable, field, cellValue);
        let cellFullText: string[] = fieldMethod.cellFullText(transformValue, field, references);
        return keywords && cellFullText.length && cellFullText.some((text) => text.toLowerCase().includes(keywords.toLowerCase()));
    } else {
        return false;
    }
};
