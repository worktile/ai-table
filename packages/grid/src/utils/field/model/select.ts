import { helpers } from 'ngx-tethys/util';
import { AITableFilterCondition, AITableFilterOperation, AITableReferences } from '../../../types';
import {
    AITable,
    AITableField,
    AITableFieldType,
    AITableSelectOption,
    AITableSelectOptionStyle,
    FieldValue,
    SelectFieldValue,
    SelectSettings
} from '../../../core';
import { isEmpty } from '../../common';
import { compareString, hasIntersect, isMeetFilter } from '../operate';
import { DEFAULT_COLORS } from 'ngx-tethys/color-picker';
import { idCreator } from '../../../core';
import { SelectFieldBase } from '@ai-table/utils';
import { FieldOperable } from '../field-operable';

export class SelectField extends SelectFieldBase implements FieldOperable<string, SelectFieldValue> {
    override isValid(cellValue: FieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: SelectFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.in:
                return Array.isArray(condition.value) && hasIntersect(cellValue, condition.value);
            case AITableFilterOperation.nin:
                return Array.isArray(condition.value) && !hasIntersect(cellValue, condition.value);
            default:
                return isMeetFilter(condition, cellValue);
        }
    }

    compare(
        cellValue1: SelectFieldValue,
        cellValue2: SelectFieldValue,
        references: AITableReferences,
        sortKey: string,
        options: {
            aiTable: AITable;
            field: AITableField;
        }
    ): number {
        const value1 = cellValueToSortValue(cellValue1, options.field);
        const value2 = cellValueToSortValue(cellValue2, options.field);
        return compareString(value1, value2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue } | null
    ): FieldValue | null {
        return toSelectFieldValue(plainText, targetField, originData);
    }
}

export function toSelectFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue } | null
): FieldValue | null {
    return null;
}

export function processPastedValueForSelect(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue } | null
): { existOptionIds: string[]; newOptions: AITableSelectOption[] } {
    const targetFieldOptions = (targetField.settings as SelectSettings)?.options || [];
    const targetOptionStyle = (targetField.settings as SelectSettings)?.option_style || AITableSelectOptionStyle.text;

    let existOptionIds: string[] = [];
    let newOptions: AITableSelectOption[] = [];

    let cellFullTexts: string[] = plainText
        .split(',')
        .map((text) => text.trim())
        .filter((text) => !!text);

    const { field, cellValue } = originData || {};
    if (field && field.type === AITableFieldType.select) {
        if (cellValue && Array.isArray(cellValue) && cellValue.length) {
            const targetOptionIds = targetFieldOptions.map((option) => option._id);
            const originOptionsMap = helpers.keyBy((field.settings as SelectSettings)?.options || [], '_id');
            cellValue.forEach((id) => {
                if (targetOptionIds.includes(id)) {
                    existOptionIds.push(id);
                } else if (targetFieldOptions.some((option) => option.text === originOptionsMap[id]?.text)) {
                    const option = targetFieldOptions.find((option: AITableSelectOption) => option.text === originOptionsMap[id].text);
                    existOptionIds.push(option!._id);
                } else {
                    const originOption = originOptionsMap[id];
                    if (originOption) {
                        const newOption = copyOption(originOption, targetFieldOptions, targetOptionStyle);
                        newOptions.push(newOption);
                    }
                }
            });
        }
    } else {
        cellFullTexts.forEach((text) => {
            const option = targetFieldOptions.find((option) => option.text === text);
            if (option) {
                existOptionIds.push(option._id);
            } else {
                const originOption = { text };
                const newOption = copyOption(originOption, targetFieldOptions, targetOptionStyle);
                newOptions.push(newOption);
            }
        });
    }

    const isMultiple = (targetField.settings as SelectSettings)?.is_multiple;
    if (isMultiple) {
        return { existOptionIds, newOptions };
    } else {
        if (existOptionIds.length) {
            return { existOptionIds: [existOptionIds[0]], newOptions: [] };
        } else {
            if (newOptions.length) {
                return { existOptionIds: [], newOptions: [newOptions[0]] };
            } else {
                return { existOptionIds: [], newOptions: [] };
            }
        }
    }
}

function copyOption(
    originOption: Partial<AITableSelectOption>,
    targetFieldOptions: AITableSelectOption[],
    targetOptionStyle: AITableSelectOptionStyle
): AITableSelectOption {
    let newOption: AITableSelectOption = {
        _id: idCreator(),
        text: originOption.text!
    };

    if (targetOptionStyle !== AITableSelectOptionStyle.text) {
        const originBgColor = originOption.bg_color;
        const existBgColors = targetFieldOptions.map((option) => option.bg_color);
        const defaultBgColor = DEFAULT_COLORS[10 + (targetFieldOptions?.length || 0)];

        newOption = {
            ...newOption,
            bg_color: originBgColor && !existBgColors.includes(originBgColor) ? originBgColor : defaultBgColor
        };
    }

    return newOption;
}

function cellValueToSortValue(cellValue: SelectFieldValue, field: AITableField): string | null {
    if (!cellValue) {
        return null;
    }
    const texts: string[] = [];
    const optionsMap = helpers.keyBy((field.settings as SelectSettings).options || [], '_id');
    if (cellValue && Array.isArray(cellValue) && cellValue.length) {
        cellValue.forEach((optionId) => {
            const option = optionsMap[optionId];
            if (option && option.text) {
                texts.push(option.text);
            }
        });
    }
    return texts && texts.length ? texts.join(',') : null;
}
