import { AddOutlinedPath, GRID_CELL, GRID_CELL_VALUE_PADDING } from '@ai-table/grid';
import { KonvaEventObject } from 'konva/lib/Node';
import { AIGrid } from '../../interface/table';
import { generateTargetName } from '../../utils/helper';
import { Icon } from '../icon';
import { Text } from '../text';
import type { AITableGridCellConfig } from './cell';
import { CellScrollContainer } from './cell-scroll-container';

export const CellText = (config: AITableGridCellConfig) => {
    const { context, x, y, recordId, field, rowHeight, columnWidth, isActive, cellValue, toggleEdit, editable, renderData } = config;
    const { aiTable } = context;
    const colors = AIGrid.getThemeColors(aiTable);
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

    // 鼠标移入时展示完整内容
    const onMouseEnter = (item: { offsetX: number; offsetY: number; text: string; width: number }) => {
        //  if (field.type === FieldType.URL && !!cellValue) {
        //      const { offsetX: innerX, offsetY: innerY, width } = item;
        //      const text = Field.bindModel(field).cellValueToString(cellValue as any) || '';
        //      setTooltipInfo({
        //          title: text,
        //          visible: true,
        //          x: x + innerX,
        //          y: y + innerY,
        //          width,
        //          height: 1
        //      });
        //  }
    };

    const renderText = () => {
        // if (renderContent == null) {
        //     const icon = Icon({
        //         name,
        //         x: columnWidth - GRID_ICON_COMMON_SIZE - GRID_CELL_VALUE_PADDING - 4,
        //         y: 24 - GRID_ICON_COMMON_SIZE,
        //         backgroundWidth: 18,
        //         backgroundHeight: 16,
        //         background: colors.defaultBg,
        //         data: enhanceTextIconMap[fieldType],
        //         transformsEnabled: 'all',
        //         listening: true,
        //     });
        //     icon.on('click', () => setActiveUrlAction(true));
        //     icon.on('tap', () => setActiveUrlAction(true));
        //     return [icon];
        // };
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
                listening: true,
                ...commonProps
            });
            return [text];
        } else {
            const texts = textData.map((item: any, index: number) => {
                const { offsetX, offsetY, text } = item;
                const listening = linkEnable;

                const textNode = Text({
                    x: offsetX + GRID_CELL_VALUE_PADDING,
                    y: offsetY + 4.5,
                    heigh: 24,
                    text,
                    listening,
                    textDecoration: listening ? 'underline' : '',
                    fill: listening ? colors.primaryColor : colors.firstLevelText,
                    ...commonProps
                });
                // textNode.on('mouseenter', () => onMouseEnter(item));
                // textNode.on('mouseout', () => clearTooltipInfo(item));
                return textNode;
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
    const container = CellScrollContainer(
        {
            context,
            x,
            y,
            columnWidth,
            rowHeight,
            fieldId,
            recordId,
            renderData
        },
        renders
    );
    return container;
};
