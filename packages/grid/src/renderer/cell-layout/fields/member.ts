import {
    AI_TABLE_CELL_MEMBER_ITEM_PADDING,
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING,
    AI_TABLE_MEMBER_ITEM_AVATAR_MARGIN_RIGHT,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_TAG_PADDING,
    Colors,
    DEFAULT_FONT_SIZE
} from '../../../constants';
import { AITableAvatarSize, AITableCellItemRenderInfo, AITableCellLayout, AITableRender } from '../../../types';
import { AITableRenderAtom, AITableRenderAtomType } from '../../../types/atom';
import { CellBaseLayout } from '../base';
import { MemberSettings } from '@ai-table/utils';
import { getAvatarBgColor, getAvatarShortName } from '../../../utils';

export class MemberLayout extends CellBaseLayout {
    constructor(render: AITableRender, cellLayoutOption: AITableCellLayout = {}) {
        super(render, {
            ...cellLayoutOption,
            itemOffsetX: cellLayoutOption.itemOffsetX || AI_TABLE_CELL_MEMBER_ITEM_PADDING,
            noMoreItem: true
        });
    }

    get startY() {
        return (AI_TABLE_ROW_BLANK_HEIGHT - AITableAvatarSize.size24) / 2;
    }

    get lineSpacing() {
        return AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING;
    }

    get itemHeight() {
        return AITableAvatarSize.size24;
    }

    override getAbsoluteItemRenderInfos(): AITableCellItemRenderInfo[] {
        const renderItems = this.renderItems;
        if (renderItems.length < this.items.length) {
            const lastItem = renderItems[renderItems.length - 1];
            const count = this.items.length - renderItems.length;
            const renderAtoms: AITableRenderAtom[] = [];
            let itemWidth = 2 * AI_TABLE_TAG_PADDING;
            const textAtom = this.getTextAtom(`+${count}`, undefined, DEFAULT_FONT_SIZE);
            itemWidth += textAtom.width!;
            renderAtoms.push({
                type: AITableRenderAtomType.circle,
                x: lastItem.x! + AITableAvatarSize.size24 / 2,
                y: lastItem.y! + AITableAvatarSize.size24 / 2,
                radius: AITableAvatarSize.size24 / 2,
                fillStyle: Colors.black,
                alpha: 0.3
            });
            renderAtoms.push({
                ...textAtom,
                x: lastItem.x! + (AITableAvatarSize.size24 - textAtom.width!) / 2,
                y: lastItem.y! + (AITableAvatarSize.size24 - DEFAULT_FONT_SIZE) / 2,
                fillStyle: Colors.white
            });
            return [
                {
                    x: lastItem.x,
                    y: lastItem.y,
                    width: itemWidth,
                    height: AITableAvatarSize.size24,
                    renderAtoms
                }
            ];
        }
        const itemRenderInfos: AITableCellItemRenderInfo[] = [];
        return itemRenderInfos;
    }

    override layout() {
        return super.layout();
    }

    getItemRenderInfo(itemValue: string, containerMaxWidth: number): AITableCellItemRenderInfo {
        const renderAtoms: AITableRenderAtom[] = [];
        const settings = this.field.settings as MemberSettings;
        const hasText = !settings?.is_multiple;
        let itemWidth = 0;
        const userInfo = this.references?.members[itemValue] || {};
        const { uid, display_name, avatar } = userInfo;
        if (hasText) {
            renderAtoms.push({
                type: AITableRenderAtomType.avatar,
                uid,
                url: avatar,
                x: 0,
                y: 0,
                title: getAvatarShortName(display_name),
                bgColor: getAvatarBgColor(display_name!)
            });
            const textX = AITableAvatarSize.size24 + AI_TABLE_MEMBER_ITEM_AVATAR_MARGIN_RIGHT;
            const textWidth = containerMaxWidth - textX;
            const textAtom = this.getTextAtom(display_name || '', textWidth, DEFAULT_FONT_SIZE);
            renderAtoms.push({
                ...textAtom,
                type: AITableRenderAtomType.text,
                x: textX,
                y: (AITableAvatarSize.size24 - DEFAULT_FONT_SIZE) / 2,
                width: textWidth
            });
        } else {
            renderAtoms.push({
                type: AITableRenderAtomType.avatar,
                uid,
                url: avatar,
                x: 0,
                y: 0,
                title: getAvatarShortName(display_name),
                bgColor: getAvatarBgColor(display_name!)
            });
            itemWidth = AITableAvatarSize.size24;
        }
        return {
            width: itemWidth,
            height: AITableAvatarSize.size24,
            renderAtoms
        } as AITableCellItemRenderInfo;
    }
}
