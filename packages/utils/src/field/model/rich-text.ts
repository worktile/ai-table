import { RichTextFieldValue } from '../../types';
import { FieldBase } from './field';

export class RichTextFieldBase extends FieldBase {
    override isValid(cellValue: RichTextFieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

    getDefaultValue() {
        return [];
    }
}
