import { Component, EventEmitter } from '@angular/core';
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
import { Sprite } from 'konva/lib/shapes/Sprite';
import { Star } from 'konva/lib/shapes/Star';
import { Text } from 'konva/lib/shapes/Text';
import { TextPath } from 'konva/lib/shapes/TextPath';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Wedge } from 'konva/lib/shapes/Wedge';
import { Stage } from 'konva/lib/Stage';
import { KoShapeConfigTypes } from '../utils/config.types';
import { KoEventObject } from './ko-event-object';

export abstract class KoComponent extends Component {
    config!: KoShapeConfigTypes;

    onMouseover?: EventEmitter<KoEventObject<MouseEvent>>;
    onMousemove?: EventEmitter<KoEventObject<MouseEvent>>;
    onMouseout?: EventEmitter<KoEventObject<MouseEvent>>;
    onMouseenter?: EventEmitter<KoEventObject<MouseEvent>>;
    onMouseleave?: EventEmitter<KoEventObject<MouseEvent>>;
    onMousedown?: EventEmitter<KoEventObject<MouseEvent>>;
    onMouseup?: EventEmitter<KoEventObject<MouseEvent>>;
    onWheel?: EventEmitter<KoEventObject<WheelEvent>>;
    onContextmenu?: EventEmitter<KoEventObject<PointerEvent>>;
    onClick?: EventEmitter<KoEventObject<MouseEvent>>;
    onDblclick?: EventEmitter<KoEventObject<MouseEvent>>;
    onTouchstart?: EventEmitter<KoEventObject<TouchEvent>>;
    onTouchmove?: EventEmitter<KoEventObject<TouchEvent>>;
    onTouchend?: EventEmitter<KoEventObject<TouchEvent>>;
    onTap?: EventEmitter<KoEventObject<TouchEvent>>;
    onDbltap?: EventEmitter<KoEventObject<TouchEvent>>;
    onDragstart?: EventEmitter<KoEventObject<MouseEvent>>;
    onDragmove?: EventEmitter<KoEventObject<MouseEvent>>;
    onDragend?: EventEmitter<KoEventObject<MouseEvent>>;

    getNode!: () =>
        | Stage
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

    getConfig!: () => KoShapeConfigTypes;
}
