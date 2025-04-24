import { isEmpty } from 'lodash';
import { AITableField, AITableReferences, FieldValue } from '../../types';

export abstract class FieldBase {
    abstract isValid(cellValue: FieldValue): boolean;

    cellFullText(transformValue: any, field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(String(transformValue));
        }
        return fullText;
    }
}
