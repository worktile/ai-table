import {
    AI_TABLE_CELL_MULTI_DOT_RADIUS,
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING,
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_SELECT_ITEM_DOT_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_SELECT_ITEM_PIECE_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_SELECT_ITEM_TAG_MIN_WIDTH,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_DOT_RADIUS,
    AI_TABLE_FILE_ITEM_MARGIN_RIGHT,
    AI_TABLE_FILE_ICON_ITEM_HEIGHT,
    AI_TABLE_FILE_ICON_SIZE,
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
import { getFileThumbnailSvgString } from '../../../utils';
import { CellBaseLayout } from '../base';
import { AITableAttachmentInfo, AITableSelectOptionStyle } from '@ai-table/utils';

export class AttachmentLayout extends CellBaseLayout<AITableCellItemRenderInfo<AITableAttachmentInfo>> {
    constructor(render: AITableRender, cellLayoutOption: AITableCellLayout = {}) {
        super(render, {
            noMoreItem: true,
            itemOffsetX: AI_TABLE_FILE_ITEM_MARGIN_RIGHT,
            ...cellLayoutOption
        });
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
        return (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_FILE_ICON_SIZE) / 2;
    }

    get lineSpacing() {
        return AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING;
    }

    get itemHeight() {
        return AI_TABLE_FILE_ICON_SIZE;
    }

    override layout() {
        return super.layout();
    }

    override get moreBgRadius() {
        return (this.field as AITableSelectField).settings.option_style === AITableSelectOptionStyle.tag
            ? AI_TABLE_OPTION_ITEM_RADIUS
            : AI_TABLE_PIECE_RADIUS;
    }

    getItemRenderInfo(itemValue: string, containerMaxWidth: number) {
        const item = (this.field as AITableSelectField).settings.options?.find((option) => option._id === itemValue);
        const { field } = this.renderInfo;
        let itemWidth = AI_TABLE_FILE_ICON_SIZE;

        const { references } = this.renderInfo;

        const attachmentInfo = references?.attachments[itemValue];
        if (!attachmentInfo) return null;
        const { title, addition } = attachmentInfo;

        const svgString = getFileThumbnailSvgString(addition?.ext);
        return {
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            source: attachmentInfo,
            renderAtoms: [
                {
                    type: AITableRenderAtomType.image,
                    x: 0,
                    y: 0,
                    width: AI_TABLE_FILE_ICON_SIZE,
                    height: AI_TABLE_FILE_ICON_SIZE,
                    image: svgString
                }
            ]
        };
    }
}
