import { NgModule } from '@angular/core';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        LoadingSpinnerComponent
    ],
    exports: [
        // Exporting this component, coz we wanna use it in other modules
        LoadingSpinnerComponent
    ]
})
export class SharedModule {

}