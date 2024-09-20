import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject
} from '@angular/core';
import Konva from 'konva';
import { FastLayer } from 'konva/lib/FastLayer';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { Arc } from 'konva/lib/shapes/Arc';
import { Arrow } from 'konva/lib/shapes/Arrow';
import { Circle } from 'konva/lib/shapes/Circle';
import { Ellipse } from 'konva/lib/shapes/Ellipse';
import { Image } from 'konva/lib/shapes/Image';
import { Label, Tag } from 'konva/lib/shapes/Label';
import { Line } from 'konva/lib/shapes/Line';
import { Path } from 'konva/lib/shapes/Path';
import { Rect } from 'konva/lib/shapes/Rect';
import { RegularPolygon } from 'konva/lib/shapes/RegularPolygon';
import { Ring } from 'konva/lib/shapes/Ring';
import { Sprite, SpriteConfig } from 'konva/lib/shapes/Sprite';
import { Star } from 'konva/lib/shapes/Star';
import { Text } from 'konva/lib/shapes/Text';
import { TextPath } from 'konva/lib/shapes/TextPath';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Wedge } from 'konva/lib/shapes/Wedge';
import { KoComponent, KoEventObject, KoShapeConfigTypes, KoShapeTypes } from '../interfaces';
import { applyNodeProps, createListener, getName, updatePicture } from '../utils';
import { KO_CONTAINER_TOKEN } from './container.token';

@Component({
    selector:
        'ko-shape, ko-circle, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow, ko-transformer',
    standalone: true,
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoShape implements OnInit, AfterViewInit, OnDestroy, KoComponent {
    @Input() set config(config: KoShapeConfigTypes) {
        this._config = config;
        this.updateNode(config);
    }
    get config(): KoShapeConfigTypes {
        return this._config;
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

    elementRef = inject(ElementRef<HTMLElement>);

    container = inject(KO_CONTAINER_TOKEN, { skipSelf: true });

    cacheProps: KoShapeConfigTypes = {};

    public nameNode: keyof typeof KoShapeTypes | 'Shape' | 'Sprite' = getName(inject(ElementRef).nativeElement.localName) as
        | keyof typeof KoShapeTypes
        | 'Shape'
        | 'Sprite';

    private _node!:
        | Shape
        | Arc
        | Arrow
        | Circle
        | Ellipse
        | Image
        | Label
        | Tag
        | Line
        | Path
        | Rect
        | RegularPolygon
        | Ring
        | Sprite
        | Star
        | Text
        | TextPath
        | Transformer
        | Wedge
        | Group
        | Layer
        | FastLayer;

    protected _config!: KoShapeConfigTypes;

    public getNode():
        | Shape
        | Arc
        | Arrow
        | Circle
        | Ellipse
        | Image
        | Label
        | Tag
        | Line
        | Path
        | Rect
        | RegularPolygon
        | Ring
        | Sprite
        | Star
        | Text
        | TextPath
        | Transformer
        | Wedge
        | Group
        | Layer
        | FastLayer {
        return this._node;
    }

    public getConfig(): KoShapeConfigTypes {
        return this._config || {};
    }

    ngOnInit(): void {
        this.initKonva();
    }

    private initKonva(): void {
        if (!this._node) {
            this._node = new Shape();
        }
        if (this.nameNode === 'Shape') {
            this._node = new Shape();
        } else if (this.nameNode === 'Sprite') {
            this._node = new Sprite(this.config as SpriteConfig);
        } else {
            this._node = new Konva[this.nameNode](undefined);
        }

        const animationStage = this._node.to.bind(this._node);
        this._node.to = (newConfig: KoShapeConfigTypes): void => {
            animationStage(newConfig);
            setTimeout(() => {
                Object.keys(this._node.attrs).forEach((key) => {
                    if (typeof this._node.attrs[key] !== 'function') {
                        this.config[key] = this._node.attrs[key];
                    }
                });
            }, 200);
        };

        if (this._config) {
            this.updateNode(this.config);
        }
    }

    protected updateNode(config: KoShapeConfigTypes): void {
        if (!this._node) return;
        const props = {
            ...config,
            ...createListener(this)
        };
        applyNodeProps(this, props, this.cacheProps);
        this.cacheProps = props;
    }

    ngAfterViewInit(): void {
        (this.container.getNode() as any).add(<Layer>this.getNode());
        updatePicture(this.container.getNode());
    }

    ngOnDestroy(): void {
        this._node?.destroy();
    }
}
