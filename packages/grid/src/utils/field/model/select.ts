import { helpers } from 'ngx-tethys/util';
import { hasIntersect, isMeetFilter } from '../operate';
import { DEFAULT_COLORS } from 'ngx-tethys/color-picker';
import { AITable, AITableQueries, isSystemField } from '../../../core';
import {
    AITableFilterCondition,
    AITableFilterOperation,
    AITableReferences,
    SelectFieldBase,
    AITableField,
    AITableFieldType,
    AITableSelectOption,
    AITableSelectOptionStyle,
    FieldValue,
    SelectFieldValue,
    SelectSettings,
    isEmpty,
    idCreator,
    SystemFieldTypes,
    generateOptionsByTexts,
    FieldOptions
} from '@ai-table/utils';
import { FieldOperable } from '../field-operable';
import { compareOption } from '../operate';
import { FieldModelMap } from '../field';

export class SelectField extends SelectFieldBase implements FieldOperable<string, SelectFieldValue> {
    override isValid(cellValue: FieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: SelectFieldValue, options: FieldOptions) {
        const selectOptions = (options?.field?.settings as SelectSettings)?.options || [];
        const validCellValue = getValidCellValue(cellValue, selectOptions);

        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(validCellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(validCellValue);
            case AITableFilterOperation.in:
                return Array.isArray(condition.value) && hasIntersect(validCellValue, condition.value);
            case AITableFilterOperation.nin:
                return Array.isArray(condition.value) && !hasIntersect(validCellValue, condition.value);
            default:
                return isMeetFilter(condition, validCellValue);
        }
    }

    compare(
        cellValue1: SelectFieldValue,
        cellValue2: SelectFieldValue,
        references: AITableReferences,
        sortKey: string,
        options: FieldOptions
    ): number {
        const selectOptions = (options.field?.settings as SelectSettings)?.options || [];
        const validCellValue1 = getValidCellValue(cellValue1, selectOptions);
        const validCellValue2 = getValidCellValue(cellValue2, selectOptions);

        return compareOption(validCellValue1, validCellValue2, selectOptions);
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
): SelectFieldValue | null {
    const targetFieldOptions = (targetField.settings as SelectSettings)?.options || [];
    const isMultiple = (targetField.settings as SelectSettings)?.is_multiple;
    const { field, cellValue } = originData || {};
    let value: SelectFieldValue = [];

    if (field && field.type === AITableFieldType.select) {
        value = getValidCellValue(cellValue as SelectFieldValue, targetFieldOptions);
    } else {
        const cellFullTexts: string[] = plainText
            .split(',')
            .map((text) => text.trim())
            .filter((text) => !!text);

        cellFullTexts.forEach((text) => {
            const option = targetFieldOptions.find((option) => option.text.trim() === text);
            if (option) {
                value.push(option._id);
            }
        });
    }

    if (value.length) {
        return isMultiple ? value : [value[0]];
    } else {
        return null;
    }
}

export function getOptionsByFieldAndRecords(aiTable: AITable, field: AITableField, references: AITableReferences) {
    let records = aiTable.records();

    let options: AITableSelectOption[] = [];
    let optionStyle: AITableSelectOptionStyle = AITableSelectOptionStyle.text;

    if (field.type === AITableFieldType.select) {
        options = (field.settings as SelectSettings)?.options || [];
        optionStyle = (field.settings as SelectSettings)?.option_style || AITableSelectOptionStyle.text;
    } else {
        const originFieldModel = FieldModelMap[field.type!];
        let optionTexts: string[] = [];

        records.forEach((record) => {
            const cellValue = isSystemField(field)
                ? AITableQueries.getSystemFieldValue(record, field.type as SystemFieldTypes)
                : AITableQueries.getFieldValue(aiTable, [record._id, field._id!]);

            const transformValue = originFieldModel.transformCellValue(cellValue, {
                aiTable,
                field
            });

            const texts = originFieldModel.cellFullText(transformValue, field, references) || [];
            optionTexts = [...optionTexts, ...texts];
        });

        options = generateOptionsByTexts(optionTexts);
    }

    return { options, optionStyle };
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

function getValidCellValue(cellValue: SelectFieldValue, options: AITableSelectOption[]) {
    const optionsMap = helpers.keyBy(options, '_id');
    const validCellValue = cellValue.filter((optionId) => !!optionsMap[optionId]);
    return validCellValue;
}
