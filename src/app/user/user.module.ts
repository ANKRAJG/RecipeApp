import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { UserComponent } from './user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations: [
        UserComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        UserRoutingModule
    ]
})

export class UserModule {

}