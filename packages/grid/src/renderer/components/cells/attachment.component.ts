import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoShape } from '../../../angular-konva/components/shape.component';
import {
    AddOutlinedPath,
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL,
    AI_TABLE_CELL_ATTACHMENT_ADD,
    AI_TABLE_CELL_ATTACHMENT_FILE,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_ITEM_MARGIN_RIGHT,
    AI_TABLE_FILE_ICON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_BLANK_HEIGHT,
    Colors
} from '../../../constants';
import { KoContainer } from '../../../angular-konva/components/container.component';
import { generateTargetName } from '../../../utils';
import { AITableActionIconConfig, AITableAttachmentConfig, AITableHoverCellConfig } from '../../../types';
import { KoEventObject } from '../../../angular-konva';
import { AITableFieldType } from '../../../core';
import { HoverCellComponent } from '../../interfaces';
import { getFileThumbnailSvgString } from '../../../utils/file';
import { isNil } from 'lodash';
import { AITableActionIcon } from '../action-icon.component';

@Component({
    selector: 'ai-table-attachments',
    template: `
        @for (attachment of attachments(); track attachment.attachmentInfo._id) {
            <ko-image [config]="attachment" (koClick)="attachmentClick($event)"></ko-image>
        }
        <ai-table-action-icon [config]="iconConfig()" (onClick)="addClick($event)"></ai-table-action-icon>
    `,
    standalone: true,
    imports: [KoContainer, KoShape, AITableActionIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellAttachment implements HoverCellComponent {
    static fieldType = AITableFieldType.attachment;

    config = input<AITableHoverCellConfig>();

    attachments = computed<AITableAttachmentConfig[]>(() => {
        const { render, aiTable, coordinate, field, recordId, readonly } = this.config()!;

        if (render) {
            const {} = aiTable;
            const { transformValue, references, columnWidth, rowHeight, style, zIndex } = render;
            if (!transformValue?.length) {
                return [];
            }
            const result =
                transformValue?.map((attachmentId: string, index: number) => {
                    const itemWidth = AI_TABLE_FILE_ICON_SIZE + AI_TABLE_FIELD_ITEM_MARGIN_RIGHT;
                    const currentX = AI_TABLE_CELL_PADDING + index * itemWidth + AI_TABLE_OFFSET;
                    let currentY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_FILE_ICON_SIZE) / 2 + AI_TABLE_OFFSET;
                    if (columnWidth != null) {
                        // 当超出列宽时，不会渲染后续内容
                        if (currentX >= columnWidth - AI_TABLE_ACTION_COMMON_SIZE - 2 * AI_TABLE_CELL_PADDING) {
                            return null;
                        }
                    }

                    const attachmentInfo = references!.attachments[attachmentId];
                    if (attachmentInfo) {
                        const svgString = getFileThumbnailSvgString(attachmentInfo.addition.ext);
                        const image = new Image();
                        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
                        return {
                            // coordinate,
                            // readonly,
                            attachmentInfo,
                            name: generateTargetName({
                                targetName: AI_TABLE_CELL_ATTACHMENT_FILE,
                                fieldId: field._id,
                                recordId,
                                mouseStyle: readonly ? 'default' : 'pointer',
                                source: attachmentInfo._id
                            }),
                            x: currentX,
                            y: currentY,
                            width: AI_TABLE_FILE_ICON_SIZE,
                            height: AI_TABLE_FILE_ICON_SIZE,
                            image,
                            listening: true
                        };
                    }
                    return null;
                }) || [];
            return result.filter((item: AITableAttachmentConfig) => !!item);
        }

        return [];
    });

    iconConfig = computed<AITableActionIconConfig>(() => {
        const { coordinate, render, field, recordId, readonly } = this.config()!;
        const offsetX = render.columnWidth - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
        const offsetY = (coordinate.rowInitSize - AI_TABLE_ACTION_COMMON_SIZE) / 2;

        return {
            coordinate,
            readonly,
            name: generateTargetName({
                targetName: AI_TABLE_CELL,
                fieldId: field._id,
                recordId,
                source: AI_TABLE_CELL_ATTACHMENT_ADD,
                mouseStyle: readonly ? 'default' : 'pointer'
            }),
            x: offsetX,
            y: offsetY,
            data: AddOutlinedPath,
            fill: Colors.gray600,
            hoverFill: Colors.primary,
            backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
            backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
            cornerRadius: AI_TABLE_ACTION_COMMON_RADIUS,
            listening: true
        };
    });

    addClick(e: KoEventObject<MouseEvent>) {
        // e.event.cancelBubble = true;
    }

    attachmentClick(e: KoEventObject<MouseEvent>) {
        // e.event.cancelBubble = true;
    }
}
