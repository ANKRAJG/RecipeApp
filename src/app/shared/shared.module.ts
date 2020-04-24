import { NgModule } from '@angular/core';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        LoadingSpinnerComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        // Exporting this component, coz we wanna use it in other modules
        LoadingSpinnerComponent,
        CommonModule
    ]
})
export class SharedModule {

}