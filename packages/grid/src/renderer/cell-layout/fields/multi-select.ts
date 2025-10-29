import {
    AI_TABLE_CELL_MULTI_DOT_RADIUS,
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING,
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_SELECT_ITEM_DOT_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_SELECT_ITEM_PIECE_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_SELECT_ITEM_TAG_MIN_WIDTH,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_DOT_RADIUS,
    AI_TABLE_OFFSET,
    AI_TABLE_OPTION_ITEM_FONT_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_RADIUS,
    AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE,
    AI_TABLE_PIECE_RADIUS,
    AI_TABLE_PIECE_WIDTH,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_TAG_PADDING,
    AI_TABLE_TEXT_GAP,
    Colors
} from '../../../constants';
import { AITableCellItemRenderInfo, AITableCellLayout, AITableRender, AITableSelectField } from '../../../types';
import { AITableRenderAtom, AITableRenderAtomType } from '../../../types/atom';
import { CellBaseLayout } from '../base';
import { AITableSelectOptionStyle } from '@ai-table/utils';

export class MultiSelectLayout extends CellBaseLayout {
    constructor(render: AITableRender, cellLayoutOption: AITableCellLayout = {}) {
        super(render, cellLayoutOption);
    }

    override get minItemWidth() {
        if ((this.field as AITableSelectField).settings?.option_style === AITableSelectOptionStyle.tag) {
            return AI_TABLE_CELL_MULTI_SELECT_ITEM_TAG_MIN_WIDTH;
        }

        if ((this.field as AITableSelectField).settings?.option_style === AITableSelectOptionStyle.piece) {
            return AI_TABLE_CELL_MULTI_SELECT_ITEM_PIECE_MIN_WIDTH;
        }

        if ((this.field as AITableSelectField).settings?.option_style === AITableSelectOptionStyle.dot) {
            return AI_TABLE_CELL_MULTI_SELECT_ITEM_DOT_MIN_WIDTH;
        }

        return AI_TABLE_CELL_MULTI_SELECT_ITEM_TAG_MIN_WIDTH;
    }

    get startY() {
        return (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_HEIGHT) / 2;
    }

    get lineSpacing() {
        return AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING;
    }

    get itemHeight() {
        return AI_TABLE_OPTION_ITEM_HEIGHT;
    }

    override layout() {
        return super.layout();
    }

    override get moreBgRadius() {
        return (this.field as AITableSelectField).settings.option_style === AITableSelectOptionStyle.tag
            ? AI_TABLE_OPTION_ITEM_RADIUS
            : AI_TABLE_PIECE_RADIUS;
    }

    getItemRenderInfo(itemValue: string, containerMaxWidth: number): AITableCellItemRenderInfo {
        const item = (this.field as AITableSelectField).settings.options?.find((option) => option._id === itemValue);
        const fontColor = Colors.gray700;
        const { field } = this.renderInfo;
        const optionStyle = (field as AITableSelectField).settings.option_style;

        let background = item?.bg_color ?? item?.color ?? Colors.primary;

        let textMaxTextWidth: number = containerMaxWidth;
        let itemWidth = 0;
        const fontSize = AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE;

        const renderAtoms: AITableRenderAtom[] = [];

        let itemX = 0;
        let textAtom: AITableRenderAtom;
        switch (optionStyle) {
            case AITableSelectOptionStyle.piece:
            case AITableSelectOptionStyle.dot:
                itemWidth += AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP + 2 * AI_TABLE_TAG_PADDING;
                textMaxTextWidth = containerMaxWidth - 2 * AI_TABLE_TAG_PADDING - AI_TABLE_PIECE_WIDTH - AI_TABLE_TEXT_GAP;
                itemX += AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP;
                textAtom = this.getTextAtom(item?.text || '', textMaxTextWidth, fontSize);
                itemWidth += textAtom.width!;

                renderAtoms.push({
                    type: AITableRenderAtomType.rect,
                    x: 0,
                    y: 0,
                    width: itemWidth,
                    height: AI_TABLE_OPTION_ITEM_HEIGHT,
                    radius: AI_TABLE_PIECE_RADIUS,
                    fillStyle: Colors.gray100
                });

                if (optionStyle === AITableSelectOptionStyle.piece) {
                    renderAtoms.push({
                        type: AITableRenderAtomType.rect,
                        x: AI_TABLE_TAG_PADDING,
                        y: (AI_TABLE_OPTION_ITEM_HEIGHT - AI_TABLE_PIECE_WIDTH) / 2 - AI_TABLE_OFFSET,
                        width: AI_TABLE_PIECE_WIDTH,
                        height: AI_TABLE_PIECE_WIDTH,
                        radius: AI_TABLE_PIECE_RADIUS,
                        fillStyle: background
                    });
                }

                if (optionStyle === AITableSelectOptionStyle.dot) {
                    renderAtoms.push({
                        type: AITableRenderAtomType.circle,
                        x: AI_TABLE_TAG_PADDING + AI_TABLE_DOT_RADIUS / 2 + 5 * AI_TABLE_OFFSET,
                        y: (AI_TABLE_OPTION_ITEM_HEIGHT - AI_TABLE_DOT_RADIUS * 2) / 2 + AI_TABLE_DOT_RADIUS - AI_TABLE_OFFSET,
                        radius: AI_TABLE_DOT_RADIUS,
                        fillStyle: background
                    });
                }

                renderAtoms.push({
                    ...textAtom,
                    x: AI_TABLE_TAG_PADDING + AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP,
                    y: (AI_TABLE_OPTION_ITEM_HEIGHT - fontSize) / 2,
                    fillStyle: fontColor
                });
                break;

            case AITableSelectOptionStyle.tag:
                textMaxTextWidth = containerMaxWidth - 2 * AI_TABLE_TAG_PADDING;
                itemWidth += 2 * AI_TABLE_TAG_PADDING;
                textAtom = this.getTextAtom(item?.text || '', textMaxTextWidth, fontSize);
                itemWidth += textAtom.width!;

                renderAtoms.push({
                    type: AITableRenderAtomType.rect,
                    x: 0,
                    y: 0,
                    width: itemWidth,
                    height: AI_TABLE_OPTION_ITEM_HEIGHT,
                    radius: AI_TABLE_OPTION_ITEM_RADIUS,
                    fillStyle: background
                });
                renderAtoms.push({
                    ...textAtom,
                    x: AI_TABLE_TAG_PADDING,
                    y: (AI_TABLE_OPTION_ITEM_HEIGHT - fontSize) / 2,
                    fillStyle: Colors.white
                });
                break;

            default:
                itemWidth += 2 * AI_TABLE_TAG_PADDING;
                textMaxTextWidth = containerMaxWidth - 2 * AI_TABLE_TAG_PADDING;
                itemX += 2 * AI_TABLE_TAG_PADDING;
                textAtom = this.getTextAtom(item?.text || '', textMaxTextWidth, fontSize);
                itemWidth += textAtom.width!;

                renderAtoms.push({
                    type: AITableRenderAtomType.rect,
                    x: 0,
                    y: 0,
                    width: itemWidth,
                    height: AI_TABLE_OPTION_ITEM_HEIGHT,
                    radius: AI_TABLE_PIECE_RADIUS,
                    fillStyle: Colors.gray100
                });

                renderAtoms.push({
                    ...textAtom,
                    x: AI_TABLE_TAG_PADDING,
                    y: (AI_TABLE_OPTION_ITEM_HEIGHT - fontSize) / 2,
                    fillStyle: fontColor
                });
                break;
        }

        return {
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            renderAtoms
        } as AITableCellItemRenderInfo;
    }
}
