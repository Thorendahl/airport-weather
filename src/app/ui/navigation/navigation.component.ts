import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
    selector: 'app-navigation',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
    showNavigation = input<boolean>(false);
}
