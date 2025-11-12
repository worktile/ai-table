import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ThySlideModule } from 'ngx-tethys/slide';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyPopoverModule } from 'ngx-tethys/popover';

import { ExpandRecordComponent } from './expand-record.component';
import { FieldEditorComponent } from './field-editor.component';
import { ExpandRecordService } from './expand-record.service';
import { GridControlService } from '../../services/grid-control.service';

@NgModule({
    imports: [ExpandRecordComponent, FieldEditorComponent],
    providers: [ExpandRecordService, GridControlService],
    exports: [ExpandRecordComponent, FieldEditorComponent]
})
export class ExpandRecordModule {}
