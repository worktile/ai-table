import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { ThyMenu, ThyMenuItem } from 'ngx-tethys/menu';
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
export class AppComponent {}
