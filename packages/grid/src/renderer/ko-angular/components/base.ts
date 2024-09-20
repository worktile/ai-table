import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Stage } from 'konva/lib/Stage';
import { KoEventObject } from '../interfaces/ko-event-object';
import { KoShapeConfigTypes } from '../utils/config.types';

@Component({
    selector: 'ko-base',
    standalone: true,
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoBase implements OnDestroy {
    protected _stage!: Stage;

    protected cacheProps: KoShapeConfigTypes = {};

    @Output() onMouseover: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onMousemove: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onMouseout: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onMouseenter: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onMouseleave: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onMousedown: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onMouseup: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onWheel: EventEmitter<KoEventObject<WheelEvent>> = new EventEmitter<KoEventObject<WheelEvent>>();
    @Output() onContextmenu: EventEmitter<KoEventObject<PointerEvent>> = new EventEmitter<KoEventObject<PointerEvent>>();
    @Output() onClick: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onDblclick: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onTouchstart: EventEmitter<KoEventObject<TouchEvent>> = new EventEmitter<KoEventObject<TouchEvent>>();
    @Output() onTouchmove: EventEmitter<KoEventObject<TouchEvent>> = new EventEmitter<KoEventObject<TouchEvent>>();
    @Output() onTouchend: EventEmitter<KoEventObject<TouchEvent>> = new EventEmitter<KoEventObject<TouchEvent>>();
    @Output() onTap: EventEmitter<KoEventObject<TouchEvent>> = new EventEmitter<KoEventObject<TouchEvent>>();
    @Output() onDbltap: EventEmitter<KoEventObject<TouchEvent>> = new EventEmitter<KoEventObject<TouchEvent>>();
    @Output() onDragstart: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onDragmove: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();
    @Output() onDragend: EventEmitter<KoEventObject<MouseEvent>> = new EventEmitter<KoEventObject<MouseEvent>>();

    ngOnDestroy(): void {
        this._stage?.destroy();
    }
}
