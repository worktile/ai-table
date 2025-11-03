import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { KoShape } from '../../../angular-konva/components/shape.component';
import {
    AddOutlinedPath,
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_ACTION_COMMON_RIGHT_PADDING,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL,
    AI_TABLE_CELL_ATTACHMENT_ADD,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FILE_ICON_SIZE,
    Colors,
    AI_TABLE_ROW_HEIGHT
} from '../../../constants';
import { generateTargetName } from '../../../utils';
import { AITableActionIconConfig, AITableAttachmentConfig } from '../../../types';
import { AITableFieldType } from '@ai-table/utils';
import { AITableActionIcon } from '../action-icon.component';
import { CoverCellBase } from './cover-cell-base';
import { AttachmentLayout } from '../../cell-layout/fields/attachment';

@Component({
    selector: 'ai-table-attachments',
    template: `
        @for (attachment of attachments(); track attachment.attachmentInfo._id) {
            <ko-image [config]="attachment"></ko-image>
        }
        <ai-table-action-icon [config]="iconConfig()"></ai-table-action-icon>
    `,
    imports: [KoShape, AITableActionIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellAttachment extends CoverCellBase {
    static override fieldType = AITableFieldType.attachment;

    attachments = computed<AITableAttachmentConfig[]>(() => {
        const { render, aiTable, field, recordId, readonly, coordinate } = this.config()!;
        const { columnWidth } = render;
        if (render) {
            const attachments = new AttachmentLayout(render, {
                renderWidth: columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_ACTION_COMMON_SIZE
            });
            return attachments.renderItems.map((renderItem) => {
                const imageAtom = renderItem.renderAtoms[0];
                const image = new Image();
                image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(imageAtom.image!)}`;
                return {
                    coordinate: coordinate,
                    attachmentInfo: renderItem.source!,
                    name: generateTargetName({
                        targetName: AI_TABLE_CELL,
                        fieldId: field._id,
                        recordId,
                        mouseStyle: readonly ? 'default' : 'pointer',
                        source: renderItem.source._id
                    }),
                    x: imageAtom.x + 0.5,
                    y: imageAtom.y + 0.5,
                    width: AI_TABLE_FILE_ICON_SIZE,
                    height: AI_TABLE_FILE_ICON_SIZE,
                    image,
                    listening: true
                };
            });
        }

        return [];
    });

    iconConfig = computed<AITableActionIconConfig>(() => {
        const { coordinate, render, field, recordId, readonly } = this.config()!;
        const offsetX = render.columnWidth - AI_TABLE_ACTION_COMMON_SIZE - AI_TABLE_ACTION_COMMON_RIGHT_PADDING;
        const offsetY = (AI_TABLE_ROW_HEIGHT - AI_TABLE_ACTION_COMMON_SIZE) / 2;

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
}
