import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
    ColumnCalendarFilledPath,
    ColumnLinkOutlinedPath,
    ColumnMemberFilledPath,
    ColumnMultipleFillPath,
    ColumnNumberFilledPath,
    ColumnProgressFilledPath,
    ColumnRatingFilledPath,
    ColumnSelectFilledPath,
    ColumnTextFilledPath
} from '../../../constants';
import { AITableFieldType, SelectSettings } from '../../../core';
import { AITableFieldTypeIconOptions } from '../../../types';
import { KoIcon } from './icon.component';

@Component({
    selector: 'ko-field-icon',
    template: ` <ko-icon [options]="iconConfig()"></ko-icon> `,
    standalone: true,
    imports: [KoIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoFieldIcon {
    config = input.required<AITableFieldTypeIconOptions>();

    iconConfig = computed(() => {
        const { field, x, y, width, height, fill } = this.config();
        let data = null;
        switch (field.type) {
            case AITableFieldType.text:
                data = ColumnTextFilledPath;
                break;
            case AITableFieldType.select:
                data = (field.settings as SelectSettings)?.is_multiple ? ColumnMultipleFillPath : ColumnSelectFilledPath;
                break;
            case AITableFieldType.date:
            case AITableFieldType.createdAt:
            case AITableFieldType.updatedAt:
                data = ColumnCalendarFilledPath;
                break;
            case AITableFieldType.number:
                data = ColumnNumberFilledPath;
                break;
            case AITableFieldType.link:
                data = ColumnLinkOutlinedPath;
                break;
            case AITableFieldType.rate:
                data = ColumnRatingFilledPath;
                break;
            case AITableFieldType.member:
            case AITableFieldType.createdBy:
            case AITableFieldType.updatedBy:
                data = ColumnMemberFilledPath;
                break;
            case AITableFieldType.progress:
                data = ColumnProgressFilledPath;
                break;
        }
        return {
            x,
            y,
            size: width,
            backgroundHeight: height,
            listening: false,
            data,
            fill
        };
    });
}
