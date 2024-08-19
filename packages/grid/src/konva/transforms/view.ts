import { AITable } from '@ai-table/grid';

// 设置鼠标样式
export const setMouseStyle = (aiTable: AITable, mouseStyle: string) => {
    const container = AITable.getContainer(aiTable);
    container.style.cursor = mouseStyle;
};
