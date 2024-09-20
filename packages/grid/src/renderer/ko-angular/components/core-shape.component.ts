import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    contentChildren,
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
import { KoComponent } from '../interfaces/ko-component';
import { updatePicture } from '../utils';
import { KoShapeConfigTypes } from '../utils/config.types';
import { applyNodeProps, createListener, getName } from '../utils/index';
import { KoShapeTypes } from '../utils/shape.types';
import { KoBase } from './base';

@Component({
    selector:
        'ko-shape, ko-layer, ko-circle, ko-fastlayer, ko-group, ko-label, ko-rect, ko-ellipse, ko-wedge, ko-line, ko-sprite, ko-image, ko-text, ko-text-path, ko-star, ko-ring, ko-arc, ko-tag, ko-path, ko-regular-polygon, ko-arrow, ko-transformer',
    standalone: true,
    template: `<div><ng-content></ng-content></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoCoreShape extends KoBase implements KoComponent, AfterContentChecked, OnDestroy, OnInit {
    @Input() set config(config: KoShapeConfigTypes) {
        this._config = config;
        this.updateNode(config);
    }
    get config(): KoShapeConfigTypes {
        return this._config;
    }

    shapes = contentChildren<KoCoreShape>(KoCoreShape);

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

    ngAfterContentChecked(): void {
        this.shapes().forEach((item: KoCoreShape) => {
            if (this !== item) {
                if (this._node instanceof Group || this._node instanceof Layer) {
                    this._node.add(item.getNode());
                }
                updatePicture(this._node);
            }
        });
    }
}
