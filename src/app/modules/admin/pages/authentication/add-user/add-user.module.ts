import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FuseAlertModule} from '@fuse/components/alert';
import {SharedModule} from 'app/shared/shared.module';
import {SignUpClassicComponent} from 'app/modules/admin/pages/authentication/sign-up/classic/sign-up.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {AddUserComponent} from "./classic/add-user.component";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
    {
        path: '',
        component: SignUpClassicComponent
    }
];

@NgModule({
    declarations: [
        AddUserComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseAlertModule,
        SharedModule,
        MatStepperModule,
        MatSelectModule
    ],
    providers: [
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}
        }
    ]
})
export class AddUserModule {
}
