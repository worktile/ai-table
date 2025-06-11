import _ from 'lodash';
import { AITableField, SelectFieldValue, SelectSettings } from '../../types';
import { FieldBase } from './field';
import { isUndefinedOrNull, keyBy, idCreator, DEFAULT_COLORS } from '../../helps';

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

export function generateOptionsByTexts(texts: string[]) {
    texts = texts.filter((value) => {
        return !isUndefinedOrNull(value) && value !== '';
    });
    texts = _.uniq(texts);

    const options = texts.map((value) => {
        const option = {
            _id: idCreator(),
            text: value,
            bg_color: DEFAULT_COLORS[10 + (texts.length || 0)]
        };
        return option;
    });
    return options;
}
