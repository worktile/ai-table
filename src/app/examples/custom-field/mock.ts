import { AITableField, AITableFieldGroup, AITableRecord } from '@ai-table/utils';
import {
    RelationField,
    RelationFieldType,
    RELATION_FIELD_DEFAULT_WIDTH,
    RELATION_FIELD_MIN_WIDTH,
    AITableCustomReferences,
    renderRelationCell,
    RelationCoverCell,
    ticketIconSvg,
    closeIconSvg
} from './relation';

export { RelationFieldType, AITableCustomReferences };

// custom fields
export const mockCustomFields = {
    [RelationFieldType.relationTicket]: {
        fieldOption: {
            type: RelationFieldType.relationTicket,
            group: AITableFieldGroup.advanced,
            name: '关联工单',
            icon: 'ticket',
            width: RELATION_FIELD_DEFAULT_WIDTH,
            minWidth: RELATION_FIELD_MIN_WIDTH
        },
        fieldModel: new RelationField(),
        render: renderRelationCell,
        coverRender: RelationCoverCell
    },
    [RelationFieldType.relationObjective]: {
        fieldOption: {
            type: RelationFieldType.relationObjective,
            group: AITableFieldGroup.advanced,
            name: '关联目标',
            icon: 'target',
            width: RELATION_FIELD_DEFAULT_WIDTH,
            minWidth: RELATION_FIELD_MIN_WIDTH
        },
        fieldModel: new RelationField(),
        render: renderRelationCell,
        coverRender: RelationCoverCell
    }
};

export const mockFields: AITableField[] = [
    {
        _id: 'fieldId_relation_ticket',
        ...mockCustomFields[RelationFieldType.relationTicket].fieldOption
    },
    {
        _id: 'fieldId_relation_objective',
        ...mockCustomFields[RelationFieldType.relationObjective].fieldOption
    }
];

export const mockRecords: AITableRecord[] = [
    {
        _id: 'recordId001',
        short_id: 'recordShortId001',
        created_at: 1760757010,
        created_by: 'memberUID002',
        updated_at: 1761650871,
        updated_by: 'memberUID002',
        values: {
            fieldId_relation_ticket: ['ticketId001', 'ticketId002', 'ticketId003'],
            fieldId_relation_objective: ['objectiveId001', 'objectiveId002']
        }
    }
];

export const mockReferences: AITableCustomReferences = {
    members: {
        memberUID001: {
            uid: 'memberUID001',
            display_name: '小明',
            display_name_pinyin: 'xiaoming',
            avatar: ''
        },
        memberUID002: {
            uid: 'memberUID002',
            display_name: '小红',
            display_name_pinyin: 'xiaohong',
            avatar: ''
        }
    },
    attachments: {},
    // custom references
    [RelationFieldType.relationTicket]: {
        ticketId001: {
            _id: 'ticketId001',
            whole_identifier: 'TCK-001',
            title: '工单1'
        },
        ticketId002: {
            _id: 'ticketId002',
            whole_identifier: 'TCK-002',
            title: '工单2'
        },
        ticketId003: {
            _id: 'ticketId003',
            whole_identifier: 'TCK-003',
            title: '工单3'
        }
    },
    [RelationFieldType.relationObjective]: {
        objectiveId001: {
            _id: 'objectiveId001',
            whole_identifier: 'OBJC-001',
            title: '目标1',
            number: 1,
            color: '#FA8888'
        },
        objectiveId002: {
            _id: 'objectiveId002',
            whole_identifier: 'OBJC-002',
            title: '目标2',
            number: 2,
            color: '#84E17E'
        }
    },
    svgMap: {
        close: closeIconSvg,
        ticketId001: ticketIconSvg,
        ticketId002: ticketIconSvg,
        ticketId003: ticketIconSvg
    }
};
