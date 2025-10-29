import { isArray } from 'lodash';
import {
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_MIN_WIDTH,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_OPTION_ITEM_FONT_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_PADDING,
    AI_TABLE_OPTION_ITEM_RADIUS,
    AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE,
    AI_TABLE_PIECE_RADIUS,
    AI_TABLE_ROW_HEIGHT,
    AI_TABLE_TAG_PADDING,
    Colors,
    DEFAULT_FONT_SIZE
} from '../../constants';
import { AITableCellItemRenderInfo, AITableCellLayout, AITableRender, AITableSelectField } from '../../types';
import { AITableField } from '@ai-table/utils';
import { helpers } from 'ngx-tethys/util';
import { AITableRenderAtom, AITableRenderAtomType } from '../../types/atom';
import { drawer } from '../drawers/drawer';

export abstract class CellBaseLayout {
    protected cellLayoutOption: AITableCellLayout;

    protected renderInfo: AITableRender;

    protected minItemWidth: number = AI_TABLE_CELL_MULTI_ITEM_DEFAULT_MIN_WIDTH;

    abstract getItemRenderInfo(item: any, containerMaxWidth: number): AITableCellItemRenderInfo;

    abstract get startY(): number;

    abstract get lineSpacing(): number;

    abstract get itemHeight(): number;

    public renderItems: AITableCellItemRenderInfo[] = [];

    get items() {
        if (isArray(this.renderInfo.transformValue)) {
            return this.renderInfo.transformValue;
        }
        return [this.renderInfo.transformValue];
    }

    get renderAtoms() {
        return this.renderItems.flatMap((item) => item.renderAtoms || []);
    }

    get field() {
        return this.renderInfo.field;
    }

    get itemOffsetX() {
        return this.cellLayoutOption.itemOffsetX || AI_TABLE_OPTION_ITEM_PADDING;
    }

    get maxRow() {
        const rows = Math.floor((this.renderInfo.rowHeight - this.startY * 2) / (this.itemHeight + this.lineSpacing));
        return rows;
    }

    get moreBgRadius() {
        return AI_TABLE_PIECE_RADIUS;
    }

    protected getValidSelectedValue(field: AITableField, transformValue: string[]) {
        const fieldOptionsMap = helpers.keyBy((field as AITableSelectField).settings.options || [], '_id');
        return (transformValue || []).filter((optionId: string) => !!fieldOptionsMap[optionId]);
    }

    constructor(render: AITableRender, cellLayoutOption: AITableCellLayout = {}) {
        this.renderInfo = render;
        this.cellLayoutOption = cellLayoutOption;
        this.layout();
    }

    layout(): AITableCellItemRenderInfo[] {
        const defaultX = AI_TABLE_CELL_PADDING;
        const defaultRenderWidth = this.renderInfo.columnWidth - 2 * AI_TABLE_CELL_PADDING;
        let rowIndex = 0;
        let cellX = defaultX;
        let cellY = this.startY;
        let remainingWidth = defaultRenderWidth;

        for (let index = 0; index < this.items.length; index++) {
            const item = this.items[index];
            const itemRenderInfo = this.getItemRenderInfo(item, remainingWidth);
            remainingWidth -= itemRenderInfo.width + this.itemOffsetX;
            this.renderItems.push({
                ...itemRenderInfo,
                renderAtoms: itemRenderInfo.renderAtoms.map((atom) => this.transformAtomXYToCellXY({ cellX, cellY }, atom))
            });
            cellX += itemRenderInfo.width;
            cellX += this.itemOffsetX;
            if (remainingWidth <= this.minItemWidth) {
                if (rowIndex + 1 >= this.maxRow) {
                    let hasMore = index + 1 < this.items.length;
                    let includeLast = remainingWidth + itemRenderInfo.width - this.itemOffsetX - 50 >= this.minItemWidth;
                    if (hasMore) {
                        const count = includeLast ? this.items.length - index - 1 : this.items.length - index;
                        const moreItemRenderInfo = this.getMoreItemRenderInfo(count);
                        if (!includeLast) {
                            this.renderItems.pop();
                            cellX -= itemRenderInfo.width;
                            cellX -= this.itemOffsetX;
                        }
                        this.renderItems.push({
                            ...moreItemRenderInfo,
                            renderAtoms: moreItemRenderInfo.renderAtoms.map((atom) => this.transformAtomXYToCellXY({ cellX, cellY }, atom))
                        });
                    }

                    break;
                }

                cellY += itemRenderInfo.height + this.lineSpacing;
                remainingWidth = defaultRenderWidth;
                cellX = defaultX;
                rowIndex++;
            }
        }

        return this.renderItems;
    }

    getMoreItemRenderInfo(count: number) {
        const renderAtoms: AITableRenderAtom[] = [];
        let itemWidth = 2 * AI_TABLE_TAG_PADDING;
        const textAtom = this.getTextAtom(`+${count}`, undefined, AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE);
        itemWidth += textAtom.width!;

        renderAtoms.push({
            type: AITableRenderAtomType.rect,
            x: 0,
            y: 0,
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            radius: this.moreBgRadius,
            fillStyle: Colors.gray100
        });
        renderAtoms.push({
            ...textAtom,
            x: AI_TABLE_TAG_PADDING,
            y: (AI_TABLE_OPTION_ITEM_HEIGHT - AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE) / 2,
            fillStyle: Colors.gray700
        });
        return {
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            renderAtoms
        };
    }

    transformAtomXYToCellXY(cellCoordinate: { cellX: number; cellY: number }, atomXY: AITableRenderAtom) {
        atomXY.x = cellCoordinate.cellX + atomXY.x;
        atomXY.y = cellCoordinate.cellY + atomXY.y;
        return atomXY;
    }

    getTextAtom(str: string, textMaxTextWidth: number | undefined, fontSize: number) {
        const { text, textWidth } = drawer.textEllipsis({
            text: str,
            maxWidth: textMaxTextWidth,
            fontSize: fontSize
        });
        return {
            type: AITableRenderAtomType.text,
            x: 0,
            y: 0,
            width: textWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            text: text,
            textWidth: textWidth,
            textMaxTextWidth: textMaxTextWidth,
            fontSize: fontSize,
            fillStyle: Colors.gray800
        };
    }
}
