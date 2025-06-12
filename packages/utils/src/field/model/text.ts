import { FieldBase } from './field';
import { TextFieldValue } from '../../types';

export class TextFieldBase extends FieldBase {
    override isValid(cellValue: TextFieldValue): boolean {
        return typeof cellValue === 'string' || cellValue === null;
    }
}
