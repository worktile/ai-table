import {
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING,
    AI_TABLE_FILE_ITEM_MARGIN_RIGHT,
    AI_TABLE_FILE_ICON_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_RADIUS,
    AI_TABLE_PIECE_RADIUS,
    AI_TABLE_ROW_BLANK_HEIGHT
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
        return AI_TABLE_FILE_ICON_SIZE;
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

    getItemRenderInfo(itemValue: string, containerMaxWidth: number) {
        let itemWidth = AI_TABLE_FILE_ICON_SIZE;
        const { references } = this.renderInfo;
        const attachmentInfo = references?.attachments[itemValue];
        if (!attachmentInfo) return null;
        const { addition } = attachmentInfo;

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
