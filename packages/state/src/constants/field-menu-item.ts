import {
    AI_TABLE_GRID_FIELD_SERVICE_MAP,
    AITable,
    AITableActions,
    AITableFieldSetting,
    AITableQueries,
    FieldModelMap,
    isSystemField
} from '@ai-table/grid';
import { ElementRef, Signal } from '@angular/core';
import _ from 'lodash';
import { Actions } from '../action';
import { AIViewTable } from '../types';
import { generateCopyName } from '../utils';
import { AITableStateI18nKey, getStateI18nTextByKey } from '../utils/i18n';
import {
    AddFieldOptions,
    AITableField,
    AITableReferences,
    FieldValue,
    MemberSettings,
    SelectSettings,
    SetFieldOptions,
    SystemFieldTypes,
    idCreator
} from '@ai-table/utils';

export const DividerMenuItem = {
    type: 'divider'
};

export const EditFieldPropertyItem = (aiTable: AITable, actions: AITableActions, references: AITableReferences) => ({
    type: 'editFieldProperty',
    name: getStateI18nTextByKey(aiTable, AITableStateI18nKey.editField),
    icon: 'edit',
    exec: (
        aiTable: AIViewTable,
        field: Signal<AITableField>,
        origin?: HTMLElement | ElementRef<any>,
        position?: { x: number; y: number }
    ) => {
        const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);
        const copyField: AITableField = _.cloneDeep(field());
        if (origin && position) {
            const popoverRef = fieldService?.editFieldProperty(aiTable, {
                field: copyField,
                references,
                isUpdate: true,
                origin: origin!,
                position
            });
            if (popoverRef && fieldService && !fieldService.aiFieldConfig?.fieldSettingComponent) {
                (popoverRef.componentInstance as AITableFieldSetting).setField.subscribe((options: SetFieldOptions) => {
                    updateFieldAndValues(aiTable, references, actions, options);
                });
            }
            return popoverRef;
        }
        return undefined;
    }
});

export const updateFieldAndValues = (
    aiTable: AIViewTable,
    references: AITableReferences,
    actions: AITableActions,
    options: SetFieldOptions
) => {
    const originField = AITableQueries.getField(aiTable, options.path)!;
    const originFieldSettings = originField.settings as MemberSettings | SelectSettings;
    const field = options.field;
    const fieldSettings = field.settings as MemberSettings | SelectSettings;
    const isSameType = field.type === originField.type;
    const isSameMultiple = fieldSettings?.is_multiple === originFieldSettings?.is_multiple;

    Actions.setField(aiTable, options.field, options.path);

    if (!isSameType || !isSameMultiple) {
        const originFieldModel = FieldModelMap[originField?.type!];
        const fieldModel = FieldModelMap[field.type];

        aiTable.records().forEach((record) => {
            let originCellValue: FieldValue;
            if (isSystemField(originField)) {
                originCellValue = AITableQueries.getSystemFieldValue(record, originField.type as SystemFieldTypes);
            } else {
                originCellValue = AITableQueries.getFieldValue(aiTable, [record._id, originField?._id!]);
            }

            const originTransformValue = originFieldModel.transformCellValue(originCellValue, {
                aiTable,
                field: originField
            });
            const originPlainText = originFieldModel.cellFullText(originTransformValue, originField, references)?.join(',');

            const originData = {
                field: originField,
                cellValue: originCellValue
            };
            const generator = aiTable.context?.aiFieldConfig()?.fieldRenderers?.[field.type]?.generator;
            const newFieldValue = fieldModel.toFieldValue(originPlainText, field, originData, references, generator);

            actions.updateFieldValue({
                path: [record._id, field._id],
                value: newFieldValue
            });
        });
    }
};

export const CopyFieldPropertyItem = (aiTable: AITable, addFieldFn: (data: AddFieldOptions) => void) => {
    const name = getStateI18nTextByKey(aiTable, AITableStateI18nKey.copyField);
    return {
        type: 'copyFieldProperty',
        name,
        icon: 'copy',
        exec: (aiTable: AIViewTable, field: Signal<AITableField>) => {
            const fields = aiTable.fields() || [];
            const maxFields = aiTable.context?.maxFields();
            if (maxFields && fields.length >= maxFields) {
                return;
            }
            const allFieldNames = fields.map((item) => item.name);
            const copyName = field().name;
            let newFieldName = generateCopyName(aiTable, allFieldNames, copyName);

            const fieldOptions: AddFieldOptions = {
                originId: field()._id,
                isDuplicate: true,
                defaultValue: {
                    ...field(),
                    _id: idCreator(),
                    name: newFieldName
                }
            };
            addFieldFn(fieldOptions);
        },
        disabled: () => {
            const fieldLength = aiTable.fields()?.length || 0;
            const maxFields = aiTable.context?.maxFields();
            return maxFields ? fieldLength >= maxFields : false;
        }
    };
};
