import { SelectFieldValue } from '../../types';
import { FieldBase } from './field';

export class SelectFieldBase extends FieldBase {
    override isValid(cellValue: SelectFieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }
}
