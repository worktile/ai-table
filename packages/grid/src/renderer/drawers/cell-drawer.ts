import _ from 'lodash';
import {
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
    AI_TABLE_CELL_EMOJI_PADDING,
    AI_TABLE_CELL_EMOJI_SIZE,
    AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_COMMON_FONT_SIZE,
    AI_TABLE_DOT_RADIUS,
    AI_TABLE_OFFSET,
    AI_TABLE_OPTION_ITEM_FONT_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_PADDING,
    AI_TABLE_OPTION_ITEM_RADIUS,
    AI_TABLE_PIECE_RADIUS,
    AI_TABLE_PIECE_WIDTH,
    AI_TABLE_PROGRESS_BAR_HEIGHT,
    AI_TABLE_PROGRESS_BAR_RADIUS,
    AI_TABLE_PROGRESS_TEXT_WIDTH,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_TAG_FONT_SIZE,
    AI_TABLE_TAG_PADDING,
    AI_TABLE_TEXT_GAP,
    Colors,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ALIGN_RIGHT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_LINE_HEIGHT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    AI_TABLE_RATE_MAX,
    StarFill,
    AI_TABLE_ICON_COMMON_SIZE,
    Check,
    Unchecked,
    AI_TABLE_ROW_HEIGHT,
    AI_TABLE_TEXT_LINE_HEIGHT
} from '../../constants';
import { AITable } from '../../core';
import { AITableField, AITableFieldType, AITableSelectOptionStyle, isEmpty, isUndefinedOrNull, numberFormat } from '@ai-table/utils';
import { AITableAvatarSize, AITableAvatarType, AITableRender, AITableSelectField } from '../../types';
import { FieldModelMap } from '../../utils';
import { Drawer } from './drawer';
import { helpers } from 'ngx-tethys/util';
import { MultiSelectLayout } from '../cell-layout/fields';
import { AITableRenderAtomType } from '../../types/atom';
import { CellBaseLayout } from '../cell-layout/base';
import { MemberLayout } from '../cell-layout/fields/member';
import { AttachmentLayout } from '../cell-layout/fields/attachment';

/**
 * 处理和渲染表格单元格的内容
 */
export class CellDrawer extends Drawer {
    // 样式初始化
    public initStyle(field: AITableField, styleProps: { fontWeight?: any }): void | null {
        const { type: fieldType } = field;
        const { fontWeight = DEFAULT_FONT_WEIGHT } = styleProps;

        switch (fieldType) {
            case AITableFieldType.text:
            case AITableFieldType.date:
            case AITableFieldType.createdAt:
            case AITableFieldType.updatedAt:
            case AITableFieldType.rate:
            case AITableFieldType.progress:
            case AITableFieldType.member:
            case AITableFieldType.createdBy:
            case AITableFieldType.updatedBy:
                return this.setStyle({ fontSize: DEFAULT_FONT_SIZE, fontWeight });
            default:
                return null;
        }
    }

    public renderCell(render: AITableRender, ctx: CanvasRenderingContext2D | undefined) {
        const { field, cellValue, aiTable, columnWidth, x, y } = render;
        const fieldType = field.type;
        const fieldMethod = FieldModelMap[fieldType];
        if (!fieldMethod.isValid(cellValue)) {
            return;
        }

        const customFieldRender = aiTable.context?.aiFieldConfig()?.customFields?.[fieldType]?.render;
        if (customFieldRender) {
            return customFieldRender(render, ctx, this);
        }

        let cellLayout: CellBaseLayout | null | undefined;

        switch (fieldType) {
            case AITableFieldType.text:
            case AITableFieldType.richText:
            case AITableFieldType.number:
            case AITableFieldType.link:
                return this.renderCellText(render, ctx);
            case AITableFieldType.select:
                cellLayout = this.renderCellSelect(ctx, render);
                break;
            case AITableFieldType.date:
            case AITableFieldType.createdAt:
            case AITableFieldType.updatedAt:
                return this.renderCellDate(render, ctx);
            case AITableFieldType.rate:
                return this.renderCellRate(render, ctx, columnWidth);
            case AITableFieldType.progress:
                return this.renderCellProgress(render, ctx);
            case AITableFieldType.member:
            case AITableFieldType.createdBy:
            case AITableFieldType.updatedBy:
                cellLayout = this.renderCellMember(render);
                break;
            case AITableFieldType.attachment:
                cellLayout = this.renderCellAttachment(render);
                break;
            case AITableFieldType.checkbox:
                return this.renderCellCheckbox(render);
            default:
                return null;
        }
        if (cellLayout) {
            this.renderAtoms(ctx, { x, y }, cellLayout as CellBaseLayout);
        }
    }

    private renderCellCheckbox(render: AITableRender) {
        const { x, y, columnWidth, transformValue, isCoverCell, isGroupFirstRender } = render;
        if (isCoverCell) {
            return;
        }
        const isChecked = !isEmpty(transformValue) && !!transformValue;
        const checkboxSize = AI_TABLE_ICON_COMMON_SIZE;
        const checkboxX = isGroupFirstRender ? x + AI_TABLE_CELL_PADDING : x + (columnWidth - checkboxSize) / 2;
        const checkboxY = y + (AI_TABLE_ROW_BLANK_HEIGHT - checkboxSize) / 2;
        this.path({
            x: checkboxX,
            y: checkboxY,
            size: 22,
            data: isChecked ? Check : Unchecked,
            fill: isChecked ? Colors.primary : Colors.gray300
        });
    }

    private renderCellText(render: AITableRender, ctx?: any) {
        const { x, y, transformValue, field, columnWidth, rowHeight, style, isGroupFirstRender } = render;
        if (isUndefinedOrNull(transformValue)) {
            return;
        }
        const fieldType = field.type;
        let renderText: string | null = fieldType === AITableFieldType.link ? transformValue?.text : transformValue;
        if (renderText == null) {
            return;
        }

        const isSingleLine = true;
        const isTextField = fieldType === AITableFieldType.text || fieldType === AITableFieldType.richText;
        const isNumberField = fieldType === AITableFieldType.number;

        if (isTextField && isSingleLine) {
            renderText = renderText.replace(/\r|\n/g, ' ');
        }

        const color = style?.color || this.colors.gray800;
        const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
        const fontWeight = style?.fontWeight;
        const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const renderX = textAlign === DEFAULT_TEXT_ALIGN_RIGHT ? x + columnWidth - AI_TABLE_CELL_PADDING : x + AI_TABLE_CELL_PADDING;
        const renderY = y + AI_TABLE_ROW_BLANK_HEIGHT / 2;
        const textDecoration = DEFAULT_TEXT_DECORATION;
        const maxRow = Math.floor((rowHeight - (AI_TABLE_ROW_HEIGHT - DEFAULT_TEXT_LINE_HEIGHT) / 2) / DEFAULT_TEXT_LINE_HEIGHT);

        if (isNumberField) {
            renderText = numberFormat(Number(renderText));
            const { text } = this.textEllipsis({
                text: renderText!,
                maxWidth: columnWidth && textMaxWidth,
                fontWeight
            });
            if (ctx) {
                let pureText = text;
                this.text({
                    x: renderX,
                    y: renderY,
                    text: pureText,
                    textAlign,
                    fillStyle: color,
                    fontWeight,
                    textDecoration,
                    verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                });
            }
        } else {
            this.wrapTextWithKonva({
                x: renderX,
                y: renderY,
                maxHeight: rowHeight - AI_TABLE_CELL_PADDING,
                text: renderText,
                maxWidth: textMaxWidth,
                maxRow,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                textAlign,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
                fillStyle: fieldType === AITableFieldType.link && !isGroupFirstRender ? Colors.primary : color,
                fontWeight,
                textDecoration,
                fieldType,
                needDraw: true
            });
        }
    }

    private renderCellSelect(ctx: any, render: AITableRender) {
        const { field } = render;
        if ((field as AITableSelectField).settings?.is_multiple) {
            return this.renderCellMultiSelect(render);
        } else {
            return this.renderSingleSelectCell(render, ctx);
        }
    }

    private getValidSelectedValue(field: AITableField, transformValue: string[]) {
        const fieldOptionsMap = helpers.keyBy((field as AITableSelectField).settings.options || [], '_id');
        return (transformValue || []).filter((optionId: string) => !!fieldOptionsMap[optionId]);
    }

    private renderCellMultiSelect(render: AITableRender) {
        const { field } = render;

        let transformValue = this.getValidSelectedValue(field, render.transformValue);
        if (!transformValue.length) {
            return;
        }
        return new MultiSelectLayout(render, {});
    }

    public renderAtoms(ctx: any, position: { x: number; y: number }, cellLayout: CellBaseLayout) {
        cellLayout.renderAtoms.forEach((atom) => {
            switch (atom.type) {
                case AITableRenderAtomType.text:
                    this.text({
                        x: position.x + atom.x,
                        y: position.y + atom.y,
                        text: atom.text!,
                        fillStyle: atom.fillStyle,
                        fontSize: atom.fontSize
                    });
                    break;
                case AITableRenderAtomType.rect:
                    if (atom.alpha) {
                        ctx.save();
                        ctx.globalAlpha = atom.alpha;
                    }
                    this.rect({
                        x: position.x + atom.x,
                        y: position.y + atom.y,
                        width: atom.width!,
                        height: atom.height!,
                        radius: atom.radius,
                        fill: atom.fillStyle
                    });
                    if (atom.alpha) {
                        ctx.restore();
                    }
                    break;
                case AITableRenderAtomType.circle:
                    if (atom.alpha) {
                        ctx.save();
                        ctx.globalAlpha = atom.alpha;
                    }
                    this.arc({
                        x: position.x + atom.x,
                        y: position.y + atom.y,
                        radius: atom.radius!,
                        fill: atom.fillStyle
                    });
                    if (atom.alpha) {
                        ctx.restore();
                    }
                    break;
                case AITableRenderAtomType.avatar:
                    this.avatar({
                        x: position.x + atom.x,
                        y: position.y + atom.y,
                        url: atom.url!,
                        id: atom.uid!,
                        title: atom.title!,
                        bgColor: atom.bgColor!,
                        type: AITableAvatarType.member,
                        size: AITableAvatarSize.size24
                    });
                    break;
                case AITableRenderAtomType.image:
                    this.image({
                        name: atom.title || Math.random().toString(),
                        x: position.x + atom.x,
                        y: position.y + atom.y,
                        url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(atom.image!)}`,
                        width: atom.width!,
                        height: atom.height!
                    });
                    break;
                default:
                    break;
            }
        });
    }

    private renderSingleSelectCell(render: AITableRender, ctx?: any) {
        const { x, y, field, columnWidth, isActive } = render;
        const transformValue = this.getValidSelectedValue(field, render.transformValue);
        if (!transformValue.length) {
            return;
        }
        if (!transformValue[0]) {
            console.warn(`single select field unexpected value: ${transformValue[0]}`);
        }
        const isOperating = isActive;
        const item = (field as AITableSelectField).settings.options?.find((option) => option._id === transformValue[0]);
        const itemName = item?.text || '';
        const getTextEllipsis = (maxTextWidth: number, fontSize: number = AI_TABLE_COMMON_FONT_SIZE) => {
            maxTextWidth -= isOperating ? AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE - AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET : 0;
            return this.textEllipsis({
                text: itemName,
                maxWidth: columnWidth && maxTextWidth,
                fontSize: fontSize
            });
        };
        if (ctx) {
            ctx.save();
            ctx.globalAlpha = 1;
            const colors = AITable.getColors();
            const optionStyle = (field as AITableSelectField).settings.option_style;
            let background = item?.bg_color ?? item?.color ?? colors.primary;
            const dotMaxTextWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PIECE_WIDTH - AI_TABLE_TEXT_GAP;
            const borderWidth = 1;
            switch (optionStyle) {
                case AITableSelectOptionStyle.dot:
                    // 这里的 AI_TABLE_OFFSET 偏移不确定是为啥（包括 piece 的），只是为了保持和编辑组件中的对齐
                    this.arc({
                        x: x + AI_TABLE_CELL_PADDING + AI_TABLE_DOT_RADIUS,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PIECE_WIDTH) / 2 + AI_TABLE_DOT_RADIUS - AI_TABLE_OFFSET,
                        radius: AI_TABLE_DOT_RADIUS,
                        fill: background
                    });
                    this.text({
                        x: x + AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(dotMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;
                case AITableSelectOptionStyle.piece:
                    this.rect({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PIECE_WIDTH) / 2 - AI_TABLE_OFFSET,
                        width: AI_TABLE_PIECE_WIDTH,
                        height: AI_TABLE_PIECE_WIDTH,
                        radius: AI_TABLE_PIECE_RADIUS,
                        fill: background
                    });
                    this.text({
                        x: x + AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(dotMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;

                case AITableSelectOptionStyle.tag:
                    const maxTextWidth = columnWidth - 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_TAG_PADDING);
                    const { textWidth, text } = getTextEllipsis(maxTextWidth, AI_TABLE_TAG_FONT_SIZE);
                    const width = Math.max(textWidth + 2 * AI_TABLE_TAG_PADDING, AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH);
                    this.tag({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                        width,
                        height: AI_TABLE_OPTION_ITEM_HEIGHT,
                        text,
                        background,
                        color: colors.white,
                        radius: AI_TABLE_OPTION_ITEM_RADIUS,
                        padding: AI_TABLE_OPTION_ITEM_PADDING,
                        fontSize: AI_TABLE_TAG_FONT_SIZE,
                        stroke: background
                    });
                    break;
                default:
                    const textMaxTextWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
                    this.text({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(textMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;
            }

            ctx.restore();
        }
        return null;
    }

    private renderCellDate(render: AITableRender, ctx?: any) {
        const { x, y, transformValue, columnWidth, style } = render;
        const colors = AITable.getColors();

        if (isUndefinedOrNull(transformValue)) {
            return;
        }

        const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const { text } = this.textEllipsis({ text: transformValue, maxWidth: columnWidth && textMaxWidth });
        if (ctx) {
            const color = style?.color || colors.gray800;
            this.text({
                x: x + AI_TABLE_CELL_PADDING,
                y: y + AI_TABLE_ROW_BLANK_HEIGHT / 2,
                text,
                fillStyle: color,
                fontWeight: style?.fontWeight,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
            });
        }
    }

    private renderCellRate(render: AITableRender, ctx: CanvasRenderingContext2D | undefined, columnWidth: number) {
        const { x, y, transformValue } = render;
        const max = AI_TABLE_RATE_MAX;
        const size = AI_TABLE_CELL_EMOJI_SIZE;

        const renderWidth = columnWidth - AI_TABLE_CELL_PADDING;
        const starWidth = AI_TABLE_CELL_EMOJI_SIZE + AI_TABLE_CELL_EMOJI_PADDING;
        const maxStar = Math.min(max, Math.floor(renderWidth / starWidth));

        return [...Array(maxStar).keys()].map((item, index) => {
            const value = index + 1;
            const checked = value <= (transformValue || 0);
            const iconX = index * size + AI_TABLE_CELL_PADDING + index * AI_TABLE_CELL_EMOJI_PADDING;
            const iconY = (AI_TABLE_ROW_BLANK_HEIGHT - size) / 2;

            if (ctx) {
                this.path({
                    x: x + iconX,
                    y: y + iconY,
                    size: 22,
                    data: StarFill,
                    fill: checked ? this.colors.waring : this.colors.gray100,
                    scaleX: 1.14,
                    scaleY: 1.14
                });
            }
        });
    }

    private renderCellProgress(render: AITableRender, ctx?: any) {
        const { x, y, transformValue, columnWidth, style, isGroupFirstRender } = render;
        const colors = AITable.getColors();
        let validateTransformValue = transformValue;
        if (isUndefinedOrNull(validateTransformValue)) {
            validateTransformValue = 0;
        }
        const width = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PROGRESS_TEXT_WIDTH;
        const height = AI_TABLE_PROGRESS_BAR_HEIGHT;
        const textHeight = AI_TABLE_COMMON_FONT_SIZE;
        const offsetX = AI_TABLE_CELL_PADDING;
        const offsetY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PROGRESS_BAR_HEIGHT) / 2;
        const textOffsetY = (AI_TABLE_ROW_BLANK_HEIGHT - textHeight) / 2;

        if (isGroupFirstRender) {
            this.text({
                x: x + offsetX,
                y: y + textOffsetY,
                text: `${validateTransformValue}%`,
                fillStyle: colors.gray800
            });
        } else {
            // 绘制背景
            this.rect({
                x: x + offsetX,
                y: y + offsetY,
                width,
                height,
                radius: AI_TABLE_PROGRESS_BAR_RADIUS,
                fill: colors.gray200
            });

            // 计算并绘制进度
            const progressWidth = (validateTransformValue / 100) * width;
            this.rect({
                x: x + offsetX,
                y: y + offsetY,
                width: progressWidth,
                height,
                radius: AI_TABLE_PROGRESS_BAR_RADIUS,
                fill: colors.success
            });

            this.text({
                x: x + offsetX + width + AI_TABLE_TEXT_GAP,
                y: y + textOffsetY,
                text: `${validateTransformValue}%`,
                fillStyle: colors.gray800
            });
        }
    }

    private renderCellMember(render: AITableRender) {
        return new MemberLayout(render, {});
    }

    private renderCellAttachment(render: AITableRender) {
        const { transformValue } = render;
        if (isUndefinedOrNull(transformValue)) {
            return;
        }

        return new AttachmentLayout(render);
    }
}

export const cellDrawer = new CellDrawer();
