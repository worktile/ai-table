import { isEmpty } from '../../helps';
import { AITableField, AITableReferences, FieldOptions, FieldValue } from '../../types';

export abstract class FieldBase {
    abstract isValid(cellValue: FieldValue): boolean;

    transformCellValue(cellValue: FieldValue, options: FieldOptions): FieldValue | null {
        if (!this.isValid(cellValue)) {
            return null;
        }
        return cellValue;
    }

    cellFullText(transformValue: any, field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(String(transformValue));
        }
        return fullText;
    }
}
