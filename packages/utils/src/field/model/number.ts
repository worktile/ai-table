import { NumberFieldValue } from '../../types';
import { FieldBase } from './field';

export const isNumberValid = (cellValue: NumberFieldValue): cellValue is NumberFieldValue => {
    return typeof cellValue === 'number' || cellValue === null;
};

export class NumberFieldBase extends FieldBase {
    override isValid(cellValue: NumberFieldValue): boolean {
        return isNumberValid(cellValue);
    }
}
