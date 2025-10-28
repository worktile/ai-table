import { Component, inject, OnInit, signal } from '@angular/core';
import { AITableGrid } from '@ai-table/grid';
import { AITableFieldType, AITableRecord } from '@ai-table/utils';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { FormsModule } from '@angular/forms';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule, ThyIconRegistry } from 'ngx-tethys/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-basic-table-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    imports: [
        AITableGrid,
        ThyPopoverModule,
        ThyPopoverModule,
        FormsModule,
        ThyIconModule,
        ThyDropdownModule,
        ThyPopoverModule,
        FormsModule,
        AITableGrid
    ],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class BasicTableExample implements OnInit {
    fields = signal([
        {
            _id: 'name',
            name: '名称',
            type: AITableFieldType.text
        },
        {
            _id: 'created_at',
            name: '创建时间',
            type: AITableFieldType.date
        }
    ]);

    records = signal<AITableRecord[]>([
        {
            _id: '1',
            short_id: '1',
            created_at: 1,
            created_by: '2',
            updated_at: 3,
            updated_by: '1',
            values: {
                name: '张三'
            }
        },
        {
            _id: '2',
            short_id: '1',
            created_at: 1,
            created_by: '2',
            updated_at: 3,
            updated_by: '1',
            values: {
                name: '李四'
                // created_at: {
                //     timestamp: 1747900029
                // }
            }
        }
    ]);

    private iconRegistry = inject(ThyIconRegistry);

    private sanitizer = inject(DomSanitizer);

    constructor() {
        this.registryIcon();
    }

    ngOnInit(): void {}

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }
}
