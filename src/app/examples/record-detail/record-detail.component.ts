import { Component, computed, signal } from '@angular/core';
import { AIFieldConfig, AITableActions, AITableGrid, AITableRecordDetailConfig } from '@ai-table/grid';
import {
    AITableRecord,
    AITableField,
    AITableReferences,
    AITable,
    AITableFieldType,
    AddRecordOptions,
    AddFieldOptions,
    CopyRecordOptions,
    SetFieldStatTypeOptions,
    UpdateFieldValueOptions,
    AITableRecordCreatedInfo,
    AITableRecordUpdatedInfo
} from '@ai-table/utils';
import {
    addFields,
    AIViewTable,
    buildRemoveFieldItem,
    CopyFieldPropertyItem,
    DividerMenuItem,
    EditFieldPropertyItem,
    withState,
    copyRecords,
    addRecords,
    Actions,
    updateFieldValues
} from '@ai-table/state';
import { getUnixTime } from 'date-fns';
import { mockRecords, mockFields, mockReferences } from './mock';
import { TextEditorExampleComponent } from './editor/text-editor.component';

// TODO  as 太多
@Component({
    selector: 'app-table-record-detail-example',
    templateUrl: './record-detail.component.html',
    imports: [AITableGrid],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class TableRecordDetailExample {
    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    aiTable!: AITable;

    plugins = [withState];

    readonly fieldConfig = computed<AIFieldConfig>(() => {
        return {
            // Look: record detail field menus
            recordDetailFieldMenus: (aiTable: AITable) => {
                return [
                    { ...EditFieldPropertyItem(aiTable as AIViewTable, this.actions, this.references()), hidden: () => false } as any,
                    {
                        ...CopyFieldPropertyItem(aiTable as AIViewTable, this.actions),
                        hidden: () => false
                    } as any,
                    { ...DividerMenuItem, hidden: () => false },
                    {
                        ...buildRemoveFieldItem(aiTable as AIViewTable, () => {
                            const member = 'member_03';
                            const time = new Date().getTime();
                            return { updated_at: time, updated_by: member };
                        }),
                        hidden: () => false
                    }
                ];
            },

            fieldRenderers: {
                [AITableFieldType.text]: {
                    // Look: record detail text cell editor
                    recordCellEditor: TextEditorExampleComponent
                }
            }
        };
    });

    // Look: record detail config
    readonly recordDetailConfig: AITableRecordDetailConfig = {
        showExpandIcon: true
    };

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    private actions: AITableActions = {
        addField: (data: AddFieldOptions) => {
            this.addField(data);
        },
        copyRecords: (data: CopyRecordOptions) => {
            this.copyRecords(data);
        },
        setField: (field: AITableField) => {
            this.setField(field);
        },
        updateFieldValues: (data: UpdateFieldValueOptions[]) => {
            this.updateFieldValues(data);
        },
        addRecord: (data: AddRecordOptions) => {
            this.addRecord(data);
        },
        setFieldStatType: (data: SetFieldStatTypeOptions) => {
            this.setFieldStatType(data);
        }
    };

    private addField(fieldOptions: AddFieldOptions) {
        addFields(this.aiTable as AIViewTable, fieldOptions);
    }

    private setField(field: AITableField) {
        Actions.setField(this.aiTable as AIViewTable, field, [field._id]);
    }

    private addRecord(recordOptions: AddRecordOptions) {
        const mockMemberUID = Object.keys(mockReferences.members)[0];
        const mockTime = getUnixTime(new Date());
        const recordCreatedInfo: AITableRecordCreatedInfo = {
            created_by: mockMemberUID,
            created_at: mockTime,
            updated_by: mockMemberUID,
            updated_at: mockTime
        };

        addRecords(this.aiTable as AIViewTable, recordOptions, recordCreatedInfo);
    }

    private copyRecords(recordOptions: CopyRecordOptions) {
        const mockMemberUID = Object.keys(mockReferences.members)[0];
        const mockTime = getUnixTime(new Date());
        const recordCreatedInfo: AITableRecordCreatedInfo = {
            created_by: mockMemberUID,
            created_at: mockTime,
            updated_by: mockMemberUID,
            updated_at: mockTime
        };
        copyRecords(this.aiTable as AIViewTable, recordOptions, recordCreatedInfo);
    }

    private updateFieldValues(valueOptions: UpdateFieldValueOptions[]) {
        const mockMemberUID = Object.keys(mockReferences.members)[0];
        const mockTime = getUnixTime(new Date());
        const recordUpdatedInfo: AITableRecordUpdatedInfo = {
            updated_by: mockMemberUID,
            updated_at: mockTime
        };

        updateFieldValues(this.aiTable as AIViewTable, valueOptions, recordUpdatedInfo);
    }

    private setFieldStatType(data: SetFieldStatTypeOptions) {
        Actions.setFieldStatType(this.aiTable as AIViewTable, data.path, data.statType);
    }
}
