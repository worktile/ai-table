import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KO_CONTAINER_TOKEN } from './container.token';
import { KoShape } from './shape.component';

@Component({
    selector: 'ko-layer, ko-fastlayer, ko-group',
    standalone: true,
    template: `<ng-content></ng-content>`,
    providers: [
        {
            provide: KO_CONTAINER_TOKEN,
            useExisting: KoContainer
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoContainer extends KoShape {}
