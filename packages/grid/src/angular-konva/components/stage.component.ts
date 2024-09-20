import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    contentChildren,
    inject
} from '@angular/core';
import { ContainerConfig } from 'konva/lib/Container';
import { Stage } from 'konva/lib/Stage';
import { KoEventObject, KoShapeConfigTypes } from '../interfaces';
import { KoComponent } from '../interfaces/component';
import { applyNodeProps, createListener } from '../utils';
import { KO_CONTAINER_TOKEN } from './container.token';
import { KoShape } from './shape.component';

@Component({
    selector: 'ko-stage',
    standalone: true,
    template: `<div><ng-content></ng-content></div>`,
    providers: [
        {
            provide: KO_CONTAINER_TOKEN,
            useExisting: KoStage
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoStage implements KoComponent, OnDestroy {
    @Input() set config(config: ContainerConfig) {
        if (!this._stage) {
            this._stage = new Stage({
                ...config,
                container: this.nodeContainer
            });
        }
        this._config = config;
        this.updateNode(config);
    }

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

    _stage!: Stage;

    shapes = contentChildren<KoShape>(KoShape);

    protected cacheProps: KoShapeConfigTypes = {};

    private nodeContainer = inject(ElementRef).nativeElement;

    private _config!: ContainerConfig;

    public getNode(): Stage {
        return this._stage;
    }

    public getConfig(): ContainerConfig {
        return this._config;
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
