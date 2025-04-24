import { isEmpty } from 'lodash';
import { ProgressFieldValue } from '../../types';
import { FieldBase } from './field';

export class ProgressFieldBase extends FieldBase {
    override isValid(cellValue: ProgressFieldValue): boolean {
        return typeof cellValue === 'number' || cellValue === null;
    }

    override cellFullText(transformValue: ProgressFieldValue): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(`${transformValue}%`);
        }
        return fullText;
    }
}
