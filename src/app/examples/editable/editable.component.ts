import { Component, signal } from '@angular/core';
import { AITableGrid } from '@ai-table/grid';
import {
    AITable,
    AITableRecord,
    AITableField,
    AITableReferences,
    AddFieldOptions,
    AddRecordOptions,
    UpdateFieldValueOptions,
    AITableRecordUpdatedInfo,
    AITableRecordCreatedInfo
} from '@ai-table/utils';
import { AIViewTable, addFields, addRecords, updateFieldValues, withState } from '@ai-table/state';
import { mockRecords, mockFields, mockReferences } from './mock';
import { getUnixTime } from 'date-fns';

@Component({
    selector: 'app-table-editable-example',
    templateUrl: './editable.component.html',
    imports: [AITableGrid],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class TableEditableExample {
    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    aiTable!: AIViewTable;

    plugins = [withState];

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.onChange = () => {};
    }

    addField(fieldOptions: AddFieldOptions) {
        addFields(this.aiTable, fieldOptions);
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
