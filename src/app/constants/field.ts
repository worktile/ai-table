import { AITableCustomFieldType } from '../types/field';

export const AI_TABLE_CELL_TICKET_ADD = 'AI_TABLE_CELL_TICKET_ADD'; // 工单cell中新增图标名称
export const AI_TABLE_CELL_MORE_COUNT = 'AI_TABLE_CELL_MORE_COUNT'; // cell中更多数量名称

export const RELATION_ICON_MAP: Record<AITableCustomFieldType, string> = {
    [AITableCustomFieldType.relationTicket]: '/assets/icons/工单.svg'
};

export const RELATION_ADD_NAME_MAP: Record<AITableCustomFieldType, string> = {
    [AITableCustomFieldType.relationTicket]: AI_TABLE_CELL_TICKET_ADD
};
