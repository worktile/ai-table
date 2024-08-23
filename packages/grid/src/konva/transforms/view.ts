import { AITable } from '@ai-table/grid';
import { AIGrid } from '../interface/table';

// 设置鼠标样式
export const setMouseStyle = (aiTable: AITable, mouseStyle: string) => {
    const container = AIGrid.getContainer(aiTable);
    container.style.cursor = mouseStyle;
};
