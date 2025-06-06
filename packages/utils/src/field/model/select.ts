import _ from 'lodash';
import { AITableField, SelectFieldValue, SelectSettings } from '../../types';
import { FieldBase } from './field';
import { keyBy } from '../../helps';

export class SelectFieldBase extends FieldBase {
    override isValid(cellValue: SelectFieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

    override cellFullText(transformValue: string[], field: AITableField): string[] {
        let fullText: string[] = [];
        const optionsMap = keyBy((field.settings as SelectSettings).options || [], '_id');
        if (transformValue && Array.isArray(transformValue) && transformValue.length) {
            transformValue.forEach((optionId) => {
                const option = optionsMap[optionId];
                if (option && option.text) {
                    fullText.push(option.text);
                }
            });
        }
        return fullText;
    }
}
