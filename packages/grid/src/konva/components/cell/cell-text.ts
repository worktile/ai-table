import { AddOutlinedPath, AITable, GRID_CELL, GRID_CELL_VALUE_PADDING } from '@ai-table/grid';
import { KonvaEventObject } from 'konva/lib/Node';
import { generateTargetName } from '../../utils/helper';
import { Icon } from '../icon';
import { Text } from '../text';
import type { AITableGridCellConfig } from './cell';

export const CellText = (config: AITableGridCellConfig) => {
    const { context, x, y, recordId, field, rowHeight, columnWidth, isActive, cellValue, toggleEdit, editable, renderData } = config;
    const { aiTable, fields, records } = context;
    const colors = AITable.getThemeColors(aiTable());
    const { type: fieldType, id: fieldId } = field;
    const name = generateTargetName({
        targetName: GRID_CELL,
        fieldId,
        recordId,
        mouseStyle: 'pointer'
    });
    const { renderContent } = renderData;
    const restIconProps = {};
    let renders = [];

    const renderText = () => {
        const { width, height, text: entityText, textData, style } = renderContent;
        const linkEnable = style?.textDecoration === 'underline';
        const commonProps = {
            name,
            lineHeight: 1.84,
            ellipsis: false,
            verticalAlign: 'top',
            align: style?.textAlign || 'left',
            fontStyle: style?.fontWeight || 'normal'
        };

        if (!textData) {
            const text = Text({
                x: GRID_CELL_VALUE_PADDING,
                y: 4.5,
                width,
                heigh: height,
                text: entityText,
                wrap: 'word',
                fill: colors.firstLevelText,
                ...commonProps
            });
            return [text];
        } else {
            const texts = textData.map((item: any, index: number) => {
                const { offsetX, offsetY, text } = item;

                return Text({
                    x: offsetX + GRID_CELL_VALUE_PADDING,
                    y: offsetY + 4.5,
                    heigh: 24,
                    text,
                    listening: false,
                    textDecoration: '',
                    fill: colors.firstLevelText,
                    ...commonProps
                });
            });
            return texts;
        }
    };

    if (renderContent == null && isActive && editable) {
        const icon = Icon({
            name,
            x: GRID_CELL_VALUE_PADDING,
            y: 5,
            data: AddOutlinedPath,
            shape: 'circle',
            backgroundWidth: 22,
            backgroundHeight: 22,
            background: 'transparent'
        });
        icon.on('mouseenter', (e: KonvaEventObject<MouseEvent>) => {});
        icon.on('mouseout', (e: KonvaEventObject<MouseEvent>) => {});
        icon.on('click', (e: KonvaEventObject<MouseEvent>) => toggleEdit);
        icon.on('tap', (e: KonvaEventObject<MouseEvent>) => toggleEdit);
        renders.push(icon);
    }
    if (isActive) {
        renders.push(...renderText());
    }
    return renders;
};
