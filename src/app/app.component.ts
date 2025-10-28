import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { ThyMenu, ThyMenuItem } from 'ngx-tethys/menu';
import { ThyIconRegistry } from 'ngx-tethys/icon';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CdkScrollable, ThyMenu, ThyMenuItem, RouterLink, RouterLinkActive],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    host: {
        class: 'app-root'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    private iconRegistry = inject(ThyIconRegistry);

    private sanitizer = inject(DomSanitizer);

    constructor() {
        this.registryIcon();
    }

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }
}
