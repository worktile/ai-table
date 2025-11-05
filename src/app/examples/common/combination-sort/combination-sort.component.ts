import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
    Component,
    computed,
    effect,
    inject,
    input,
    model,
    output,
    Pipe,
    PipeTransform,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    ViewContainerRef,
    WritableSignal
} from '@angular/core';
import { Id, AITableField, AITableSort, SortDirection, AITableFieldType } from '@ai-table/utils';
import { FormsModule } from '@angular/forms';
import { ThyAction } from 'ngx-tethys/action';
import { ThyBadge } from 'ngx-tethys/badge';
import { ThyButton } from 'ngx-tethys/button';
import { ThyCheckbox } from 'ngx-tethys/checkbox';
import { ThyDialogBody, ThyDialogFooter, ThyDialogHeader } from 'ngx-tethys/dialog';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopover } from 'ngx-tethys/popover';
import { ThySegment, ThySegmentEvent, ThySegmentItem } from 'ngx-tethys/segment';
import { ThySelect } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { ThySwitch } from 'ngx-tethys/switch';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';
import { Dictionary } from 'ngx-tethys/types';
import { coerceBooleanProperty, helpers } from 'ngx-tethys/util';
import { ComponentTypeOrTemplateRef } from 'ngx-tethys/core';
import * as _ from 'lodash';

@Pipe({
    name: 'selectableOptions',
    standalone: true
})
class SelectableOptionsExamplePipe implements PipeTransform {
    transform(sortBy: Id, fields: AITableField[], sorts: AITableSort[]): AITableField[] {
        const sortsMap = helpers.keyBy(sorts, 'sort_by');
        return fields.filter((field) => field._id === sortBy || !sortsMap[field._id]);
    }
}

@Component({
    selector: 'combination-sort-example',
    templateUrl: './combination-sort.component.html',
    styleUrls: ['./combination-sort.scss'],
    imports: [
        ThyDialogBody,
        ThyDialogHeader,
        ThyDialogFooter,
        ThySwitch,
        ThyButton,
        ThySelect,
        ThySegment,
        ThySegmentItem,
        ThyIcon,
        ThyAction,
        FormsModule,
        ThyOption,
        NgClass,
        SelectableOptionsExamplePipe,
        CdkDropList,
        CdkDrag,
        ThyBadge,
        ThyTooltipDirective,
        ThyCheckbox
    ]
})
export class CombinationSortExample {
    private thyPopover = inject(ThyPopover);

    private viewContainerRef = inject(ViewContainerRef);

    readonly title = input<string>('排序');

    readonly icon = input<string>('sort');

    readonly placeholder = input<string>('选择一列进行排序');

    /**
     * Selectable fields
     */
    readonly fields = input<AITableField[]>([]);

    /**
     * Selected sorts
     */
    readonly sorts = input<AITableSort[]>([]);

    /**
     * Maximum number of sorts
     */
    readonly limitCount = input<number>(3);

    /**
     * Whether to display the automatic sort switch
     */
    readonly showKeepSort = input(false, { transform: coerceBooleanProperty });

    /**
     * Whether to enable automatic sort
     */
    readonly isKeepSort = model<boolean>(false);

    readonly sortChange = output<{ isKeepSort: boolean; sorts: AITableSort[] }>();

    readonly sortTemplate = viewChild<TemplateRef<any>>('sortPanel');

    readonly addableSortFields = computed(() => {
        const selectedSortsMap = helpers.keyBy(this.selectedSorts(), 'sort_by');
        return this.fields().filter((field) => !selectedSortsMap[field._id!]);
    });

    readonly fieldsMap = computed<Dictionary<AITableField>>(() => {
        return helpers.keyBy(this.fields(), '_id');
    });

    newSortId = signal(null);

    AITableFieldType = AITableFieldType;

    SortDirection = SortDirection;

    public isPopoverOpened = signal(false);

    readonly selectedSorts: WritableSignal<AITableSort[]> = signal([]);

    constructor() {
        effect(() => {
            const fields = this.fields();
            untracked(() => {
                const isChanged = this.updateSorts(this.selectedSorts());
                if (isChanged) {
                    this.sortsChange();
                }
            });
        });

        effect(() => {
            const sorts = this.sorts();
            untracked(() => {
                this.updateSorts(sorts);
            });
        });
    }

    openViewSort(event: Event) {
        this.thyPopover.open(this.sortTemplate() as ComponentTypeOrTemplateRef<any>, {
            origin: event.currentTarget as HTMLElement,
            placement: 'bottomLeft',
            width: '480px',
            insideClosable: false,
            originActiveClass: 'active',
            viewContainerRef: this.viewContainerRef,
            initialState: {}
        });
    }

    sortByChange(id: string, sort: AITableSort) {
        this.selectedSorts.update((sorts) => {
            const updateIndex = sorts.indexOf(sort);
            const newSorts = [...sorts];
            newSorts[updateIndex] = {
                ...newSorts[updateIndex],
                sort_by: id
            };
            return newSorts;
        });

        if (this.isKeepSort()) {
            this.sortsChange();
        }
    }

    sortDirectionChange(event: ThySegmentEvent, sort: AITableSort) {
        this.selectedSorts.update((sorts: AITableSort[]) => {
            const updateIndex = sorts.indexOf(sort);
            const newSorts = [...sorts];
            newSorts[updateIndex] = {
                sort_by: sort.sort_by,
                direction: event.activeIndex === 1 ? SortDirection.descending : SortDirection.ascending
            };
            return newSorts;
        });
        if (this.isKeepSort()) {
            this.sortsChange();
        }
    }

    addSortItem(value: Id) {
        this.selectedSorts.update((item) => {
            return [
                ...item,
                {
                    sort_by: value,
                    direction: SortDirection.ascending
                }
            ];
        });
        setTimeout(() => {
            this.newSortId.set(null);
        }, 0);
        if (this.isKeepSort()) {
            this.sortsChange();
        }
    }

    deleteSortItem(index: number) {
        this.selectedSorts.update((item) => {
            return item.filter((_, i) => i !== index);
        });
        if (this.isKeepSort()) {
            this.sortsChange();
        }
    }

    keepShortChange() {
        this.sortsChange();
    }

    sortsChange() {
        this.sortChange.emit({ isKeepSort: this.isKeepSort(), sorts: this.selectedSorts() });
    }

    updateSorts(sorts: AITableSort[]): boolean {
        const newSorts = sorts.filter((sort) => {
            return this.fields().some((field) => field._id === sort.sort_by);
        });

        if (!_.isEqual(newSorts, this.selectedSorts())) {
            this.selectedSorts.set(newSorts);
            return true;
        }
        return false;
    }

    trackBy = (index: number, sort: AITableSort) => {
        return sort.sort_by ?? index;
    };

    drop(event: CdkDragDrop<AITableSort[]>) {
        const sorts = [...this.selectedSorts()];
        moveItemInArray(sorts, event.previousIndex, event.currentIndex);
        this.selectedSorts.set(sorts);
        if (this.isKeepSort()) {
            this.sortsChange();
        }
    }

    ok() {
        this.sortsChange();
        this.close();
    }

    close() {
        this.thyPopover.close();
    }
}
