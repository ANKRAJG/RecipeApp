import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../user/authentication.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    constructor(private authService: AuthenticationService) {}

    ngOnInit(): void {}

    onLogout() {
        this.authService.logout();
    }
}