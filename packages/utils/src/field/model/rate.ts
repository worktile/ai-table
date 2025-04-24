import { RateFieldValue } from '../../types';
import { FieldBase } from './field';
import { isNumberValid } from './number';

export class RateFieldBase extends FieldBase {
    override isValid(cellValue: RateFieldValue): boolean {
        return isNumberValid(cellValue);
    }
}
