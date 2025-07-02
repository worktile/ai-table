import _ from 'lodash';
import { AITableField, AITableStatType, SelectFieldValue, SelectSettings } from '../../types';
import { FieldBase } from './field';
import { isUndefinedOrNull, keyBy, idCreator, DEFAULT_COLORS } from '../../helps';
import { DEFAULT_FIELD_STAT_TYPE_MAP } from '../../constants';

export class SelectFieldBase extends FieldBase {
    constructor() {
        super([
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.None]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.CountAll]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Filled]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Empty]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentFilled]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentEmpty]!
        ]);
    }
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

    const options = texts.map((value, index) => {
        const option = {
            _id: idCreator(),
            text: value,
            bg_color: DEFAULT_COLORS[10 + (texts.length + index || 0)]
        };
        return option;
    });
    return options;
}
