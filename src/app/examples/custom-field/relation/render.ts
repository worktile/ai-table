import {
    AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    CellBaseLayout,
    AITableCellItemRenderInfo,
    AI_TABLE_TAG_PADDING,
    AITableRenderAtom,
    AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE,
    AITableRenderAtomType,
    AI_TABLE_PIECE_RADIUS,
    Colors,
    AI_TABLE_OPTION_ITEM_RADIUS,
    CellDrawer,
    AITableRender
} from '@ai-table/grid';
import { isUndefinedOrNull } from 'ngx-tethys/util';
import { AITableReferences } from '@ai-table/utils';
import { AITableCustomReferences, RelationInfo, RelationFieldType } from './types';

export function relationCellRender(
    render: AITableRender<AITableReferences>,
    ctx: CanvasRenderingContext2D | undefined,
    drawer: CellDrawer
) {
    const { transformValue, x, y } = render;
    if (isUndefinedOrNull(transformValue) || !transformValue.length) {
        return;
    }
    const cellLayout = new RelationCellLayout(render, {});
    drawer.renderAtoms(ctx, { x, y }, cellLayout as CellBaseLayout);
}

export class RelationCellLayout extends CellBaseLayout {
    get startY() {
        return (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_HEIGHT) / 2;
    }

    get lineSpacing() {
        return AI_TABLE_CELL_MULTI_ITEM_DEFAULT_LINE_SPACING;
    }

    get itemHeight() {
        return AI_TABLE_OPTION_ITEM_HEIGHT;
    }

    getItemRenderInfo(value: string, containerMaxWidth: number): AITableCellItemRenderInfo {
        const fieldType = this.field.type as keyof AITableCustomReferences;
        if (fieldType === RelationFieldType.relationObjective) {
            return this.getItemRenderInfoWithTag(value, containerMaxWidth);
        }
        return this.getItemRenderInfoWithIcon(value, containerMaxWidth);
    }

    private getItemRenderInfoWithIcon(value: string, containerMaxWidth: number): AITableCellItemRenderInfo {
        const references = this.references as AITableCustomReferences;
        const fieldType = this.field.type as keyof AITableCustomReferences;
        const item = references?.[fieldType]?.[value] as RelationInfo;
        const fontSize = AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE;
        const fontColor = Colors.gray700;
        const spaceWidth = 4;
        let textMaxTextWidth: number = containerMaxWidth - 2 * AI_TABLE_TAG_PADDING;
        const titleAtom: AITableRenderAtom = this.getTextAtom(item?.title || '', textMaxTextWidth, fontSize);
        const iconSize = 14;
        const iconWidth = iconSize + spaceWidth;

        let identifierWidth = 0;
        let identifierAtom: AITableRenderAtom | undefined;
        if (item.whole_identifier) {
            identifierAtom = this.getTextAtom(item.whole_identifier, textMaxTextWidth, fontSize);
            identifierWidth = identifierAtom.width! + spaceWidth;
        }

        const titleWidth = titleAtom.width!;

        let itemWidth = AI_TABLE_TAG_PADDING + iconWidth + identifierWidth + titleWidth + AI_TABLE_TAG_PADDING;

        let renderAtoms: AITableRenderAtom[] = [];

        // background tag
        renderAtoms.push({
            type: AITableRenderAtomType.rect,
            x: 0,
            y: 0,
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            radius: AI_TABLE_PIECE_RADIUS,
            fillStyle: Colors.gray100
        });

        // option style icon
        renderAtoms.push({
            type: AITableRenderAtomType.image,
            x: AI_TABLE_TAG_PADDING,
            y: (AI_TABLE_OPTION_ITEM_HEIGHT - iconSize) / 2,
            width: iconSize,
            height: iconSize,
            image: references.svgMap?.[item._id] || ''
        });

        // whole identifier
        if (identifierAtom) {
            renderAtoms.push({
                ...identifierAtom,
                x: AI_TABLE_TAG_PADDING + iconWidth,
                y: (AI_TABLE_OPTION_ITEM_HEIGHT - fontSize) / 2,
                fillStyle: fontColor
            });
        }

        // title
        renderAtoms.push({
            ...titleAtom,
            x: AI_TABLE_TAG_PADDING + iconWidth + identifierWidth,
            y: (AI_TABLE_OPTION_ITEM_HEIGHT - fontSize) / 2,
            fillStyle: fontColor
        });

        return {
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            renderAtoms
        } as AITableCellItemRenderInfo;
    }

    private getItemRenderInfoWithTag(value: string, containerMaxWidth: number): AITableCellItemRenderInfo {
        const references = this.references as AITableCustomReferences;
        const fieldType = this.field.type as keyof AITableCustomReferences;
        const item = references?.[fieldType]?.[value] as RelationInfo;
        const fontSize = AI_TABLE_OPTION_MULTI_ITEM_FONT_SIZE;
        const fontColor = Colors.gray700;
        const spaceWidth = 4;

        let renderAtoms: AITableRenderAtom[] = [];
        let textMaxTextWidth: number = containerMaxWidth - 2 * AI_TABLE_TAG_PADDING;

        // option style tag
        const tagPadding = 10;
        const tagHeight = 16;
        const tagTextAtom: AITableRenderAtom = this.getTextAtom(`O${item.number}`, textMaxTextWidth, fontSize);
        const tagSize = tagPadding + tagTextAtom.width! + tagPadding;
        const tagWidth = tagSize + spaceWidth;
        // title
        const titleAtom: AITableRenderAtom = this.getTextAtom(item?.title || '', textMaxTextWidth, fontSize);
        const titleWidth = titleAtom.width!;
        // background tag
        let itemWidth = AI_TABLE_TAG_PADDING + tagWidth + titleWidth + AI_TABLE_TAG_PADDING;

        // background tag
        renderAtoms.push({
            type: AITableRenderAtomType.rect,
            x: 0,
            y: 0,
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            radius: AI_TABLE_PIECE_RADIUS,
            fillStyle: Colors.gray100
        });

        // option style tag
        renderAtoms.push({
            type: AITableRenderAtomType.rect,
            x: AI_TABLE_TAG_PADDING,
            y: (AI_TABLE_OPTION_ITEM_HEIGHT - tagHeight) / 2,
            width: tagSize,
            height: tagHeight,
            radius: AI_TABLE_OPTION_ITEM_RADIUS,
            fillStyle: hexToRgba(item.color!, 0.1)
        });
        renderAtoms.push({
            ...tagTextAtom,
            x: AI_TABLE_TAG_PADDING + tagPadding,
            y: (AI_TABLE_OPTION_ITEM_HEIGHT - fontSize) / 2,
            fillStyle: item.color!
        });

        // title
        renderAtoms.push({
            ...titleAtom,
            x: AI_TABLE_TAG_PADDING + tagWidth,
            y: (AI_TABLE_OPTION_ITEM_HEIGHT - fontSize) / 2,
            fillStyle: fontColor
        });

        return {
            width: itemWidth,
            height: AI_TABLE_OPTION_ITEM_HEIGHT,
            renderAtoms
        } as AITableCellItemRenderInfo;
    }
}

export function hexToRgba(hex: string, opacity: number = 1) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
