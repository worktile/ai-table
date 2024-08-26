import { Colors, GRID_CELL, GRID_CELL_PADDING } from '../../../constants';
import { AITableCellOptions, AITableRenderContentBase } from '../../../types/cell';
import { generateTargetName } from '../../../utils';
import { Text } from '../text';
import { CellScrollContainer } from './scroll-container';

export const CellText = (options: AITableCellOptions) => {
    const { x, y, recordId, field, rowHeight, columnWidth, renderData, isActive, cellValue } = options;
    const [isAddIconHover, setAddIconHover] = useState(false);
    const [isHover, setHover] = useState(false);
    const { type: fieldType, _id: fieldId } = field;
    const name = generateTargetName({
        targetName: GRID_CELL,
        fieldId,
        recordId,
        mouseStyle: 'pointer'
    });
    const { renderContent } = renderData;

    const renderText = () => {
        const { width, height, text: entityText, textData, style } = renderContent as AITableRenderContentBase;
        const commonOptions = {
            name,
            lineHeight: 1.84,
            ellipsis: false,
            verticalAlign: 'top',
            align: style?.textAlign || 'left',
            fontStyle: style?.fontWeight || 'normal'
        };

        let textElement;
        if (textData == null) {
            textElement = Text({
                x: GRID_CELL_PADDING,
                y: 4.5,
                width,
                height,
                text: entityText,
                wrap: 'word',
                fill: Colors.defaultTextFill,
                ...commonOptions
            });
        } else {
            textElement = textData.map((item, index) => {
                const { offsetX, offsetY, text } = item;
                const listening = false;
                return Text({
                    x: offsetX + GRID_CELL_PADDING,
                    y: offsetY + 4.5,
                    heigh: 24,
                    text,
                    listening,
                    textDecoration: listening ? 'underline' : '',
                    fill: listening ? Colors.primary : Colors.defaultTextFill,
                    ...commonOptions
                });
            });
        }
    };

    const children = isActive ? renderText() : null;
    const cellScrollContainer = CellScrollContainer({
        x,
        y,
        columnWidth,
        rowHeight,
        fieldId,
        recordId,
        renderData,
        children
    });
    return cellScrollContainer;
};
