import { AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, contentChildren, inject } from '@angular/core';
import { ContainerConfig } from 'konva/lib/Container';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { KoComponent } from '../interfaces/ko-component';
import { applyNodeProps, createListener, updatePicture } from '../utils/index';
import { KoBase } from './base';
import { KoCoreShape } from './core-shape.component';

@Component({
    selector: 'ko-stage',
    standalone: true,
    template: `<div><ng-content></ng-content></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoStage extends KoBase implements KoComponent, AfterContentInit, OnDestroy {
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

    shapes = contentChildren<KoCoreShape>(KoCoreShape);

    private nodeContainer = inject(ElementRef).nativeElement;

    private _config!: ContainerConfig;

    ngAfterContentInit(): void {
        this.shapes().forEach((item: KoCoreShape) => {
            if (!(item.getNode() instanceof Layer)) {
                throw 'You can only add Layer Nodes to Stage Nodes!';
            }
            this._stage.add(<Layer>item.getNode());
            updatePicture(this._stage);
        });
    }

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
}
