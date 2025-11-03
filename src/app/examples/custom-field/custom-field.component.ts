import { Component, computed, signal } from '@angular/core';
import { AI_TABLE_CELL, AITable, AITableGrid, expandCell, KoEventObjectOutput } from '@ai-table/grid';
import {
    AITableRecord,
    AITableField,
    AITableReferences,
    AITableFieldType,
    AITableFieldOption,
    AITableRecordUpdatedInfo,
    UpdateFieldValueOptions,
    AddFieldOptions
} from '@ai-table/utils';
import { mockRecords, mockFields, mockReferences, mockCustomFields, RelationFieldType } from './mock';
import { AITableRecordCreatedInfo, AddRecordOptions } from '@ai-table/utils';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { addFields, addRecords, updateFieldValues, Actions, AIViewTable, withState } from '@ai-table/state';
import { getUnixTime } from 'date-fns';

@Component({
    selector: 'app-table-custom-field-example',
    templateUrl: './custom-field.component.html',
    imports: [AITableGrid, ThyPopoverModule],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class TableCustomFieldExample {
    aiTable!: AIViewTable;

    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    plugins = [withState];

    readonly fieldConfig = computed(() => {
        return {
            //自定义可选字段及排序
            filterFieldOptions: (fieldOptions: AITableFieldOption[]) => {
                return this.filterAndSortFieldOptions(fieldOptions);
            },
            // 自定义字段类型
            customFields: mockCustomFields
        };
    });

    // 进入编辑状态
    dbClick(e: KoEventObjectOutput<MouseEvent>) {
        const { targetName, fieldId, recordId } = e.targetNameDetail;
        if (targetName === AI_TABLE_CELL) {
            const field = this.aiTable.fieldsMap()[fieldId!];
            if ([RelationFieldType.relationTicket, RelationFieldType.relationObjective].includes(field?.type as RelationFieldType)) {
                expandCell(this.aiTable, [recordId!, fieldId!]);
            }
        }
    }

    private filterAndSortFieldOptions = (fieldOptions: AITableFieldOption[]) => {
        const fieldOptionMap = new Map<string, AITableFieldOption>();
        fieldOptions.forEach((fieldOption) => {
            const isMultiple = (fieldOption?.settings as any)?.['is_multiple'];
            const key = `${fieldOption.type}${isMultiple ? '_multiple' : ''}`;
            fieldOptionMap.set(key, fieldOption);
        });

        const fieldOptionKeys = [
            AITableFieldType.text,
            AITableFieldType.number,
            AITableFieldType.select,
            `${AITableFieldType.select}_multiple`,
            RelationFieldType.relationTicket,
            RelationFieldType.relationObjective
        ];

        return fieldOptionKeys.map((key) => fieldOptionMap.get(key)).filter((v): v is AITableFieldOption => !!v);
    };

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.onChange = () => {};
    }

    addField(fieldOptions: AddFieldOptions) {
        addFields(this.aiTable, fieldOptions);
    }

    setField(field: AITableField) {
        Actions.setField(this.aiTable, field, [field._id]);
    }

    addRecord(recordOptions: AddRecordOptions) {
        const mockMemberUID = Object.keys(mockReferences.members)[0];
        const mockTime = getUnixTime(new Date());
        const recordCreatedInfo: AITableRecordCreatedInfo = {
            created_by: mockMemberUID,
            created_at: mockTime,
            updated_by: mockMemberUID,
            updated_at: mockTime
        };

        addRecords(this.aiTable, recordOptions, recordCreatedInfo);
    }

    updateFieldValues(valueOptions: UpdateFieldValueOptions[]) {
        const mockMemberUID = Object.keys(mockReferences.members)[0];
        const mockTime = getUnixTime(new Date());
        const recordUpdatedInfo: AITableRecordUpdatedInfo = {
            updated_by: mockMemberUID,
            updated_at: mockTime
        };

        updateFieldValues(this.aiTable, valueOptions, recordUpdatedInfo);
    }
}
