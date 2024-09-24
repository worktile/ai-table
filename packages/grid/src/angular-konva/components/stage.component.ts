import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    effect,
    inject,
    input
} from '@angular/core';
import { ContainerConfig } from 'konva/lib/Container';
import { Stage } from 'konva/lib/Stage';
import { KoEventObject, KoShapeConfigTypes } from '../interfaces';
import { KoComponent } from '../interfaces/component';
import { applyNodeProps, createListener } from '../utils';
import { KO_CONTAINER_TOKEN } from './container.token';

@Component({
    selector: 'ko-stage',
    standalone: true,
    template: `<ng-content></ng-content>`,
    providers: [
        {
            provide: KO_CONTAINER_TOKEN,
            useExisting: KoStage
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoStage implements KoComponent, OnInit, OnDestroy {
    config = input<ContainerConfig>();

    @Output() koMouseover = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koMousemove = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koMouseout = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koMouseenter = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koMouseleave = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koMousedown = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koMouseup = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koWheel = new EventEmitter<KoEventObject<WheelEvent>>();

    @Output() koContextmenu = new EventEmitter<KoEventObject<PointerEvent>>();

    @Output() koClick = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koDblclick = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koTouchstart = new EventEmitter<KoEventObject<TouchEvent>>();

    @Output() koTouchmove = new EventEmitter<KoEventObject<TouchEvent>>();

    @Output() koTouchend = new EventEmitter<KoEventObject<TouchEvent>>();

    @Output() koTap = new EventEmitter<KoEventObject<TouchEvent>>();

    @Output() koDbltap = new EventEmitter<KoEventObject<TouchEvent>>();

    @Output() koDragstart = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koDragmove = new EventEmitter<KoEventObject<MouseEvent>>();

    @Output() koDragend = new EventEmitter<KoEventObject<MouseEvent>>();

    private _stage!: Stage;

    private cacheProps: KoShapeConfigTypes = {};

    private nodeContainer = inject(ElementRef).nativeElement;

    constructor() {
        effect(() => {
            if (this.config()) {
                if (!this._stage) {
                    this.initStage();
                }
                this.updateNode(this.config()!);
            }
        });
    }

    ngOnInit() {
        this.initStage();
    }

    public getNode(): Stage {
        return this._stage;
    }

    private initStage(): void {
        this._stage = new Stage({
            ...this.config(),
            container: this.nodeContainer
        });
    }

    private updateNode(config: ContainerConfig): void {
        const props = {
            ...config,
            ...createListener(this)
        };
        applyNodeProps(this, props, this.cacheProps);
        this.cacheProps = props;
    }

    ngOnDestroy(): void {
        this._stage?.destroy();
    }
}
