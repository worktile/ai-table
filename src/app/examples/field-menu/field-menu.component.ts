import { Component, signal, computed } from '@angular/core';
import {
    AITable,
    AITableRecord,
    AITableField,
    AITableReferences,
    AddFieldOptions,
    UpdateFieldValueOptions,
    AddRecordOptions,
    AITableRecordUpdatedInfo,
    AITableRecordCreatedInfo,
    SetFieldStatTypeOptions
} from '@ai-table/utils';
import { AIFieldConfig, AITableActions, AITableGrid } from '@ai-table/grid';
import {
    withState,
    Actions,
    AIViewTable,
    addFields,
    addRecords,
    updateFieldValues,
    EditFieldPropertyItem,
    CopyFieldPropertyItem
} from '@ai-table/state';
import { mockRecords, mockFields, mockReferences } from './mock';
import { getUnixTime } from 'date-fns';
import { ThyPopoverModule } from 'ngx-tethys/popover';

@Component({
    selector: 'app-table-field-menu-example',
    templateUrl: './field-menu.component.html',
    imports: [AITableGrid, ThyPopoverModule],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class TableFieldMenuExample {
    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    readonly = signal<boolean>(false);

    aiTable!: AIViewTable;

    plugins = [withState];

    // 配置列菜单
    fieldConfig = computed<AIFieldConfig>(() => {
        const readonly = this.readonly();
        return {
            fieldMenus: (aiTable: AITable) => {
                return [
                    { ...EditFieldPropertyItem(aiTable as AIViewTable, this.actions, this.references()), hidden: () => readonly } as any,
                    {
                        ...CopyFieldPropertyItem(aiTable as AIViewTable, this.actions),
                        hidden: () => readonly
                    }
                ];
            }
        };
    });

    private actions: AITableActions = {
        addField: (data: AddFieldOptions) => {
            this.addField(data);
        },
        setField: (field: AITableField) => {
            this.setField(field);
        },
        updateFieldValues: (data: UpdateFieldValueOptions[]) => {
            this.updateFieldValues(data);
        },
        // no need in this example
        addRecord: (data: AddRecordOptions) => {
            this.addRecord(data);
        },
        setFieldStatType: (data: SetFieldStatTypeOptions) => {
            this.setFieldStatType(data);
        }
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

    setFieldStatType(data: SetFieldStatTypeOptions) {
        Actions.setFieldStatType(this.aiTable, data.path, data.statType);
    }
}
