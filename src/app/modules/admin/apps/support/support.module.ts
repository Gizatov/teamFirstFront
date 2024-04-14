import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { HelpCenterSupportComponent } from 'app/modules/admin/apps/support/support.component';
import {supportRouting} from "./support.routing";
import {MatSliderModule} from "@angular/material/slider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
    declarations: [
        HelpCenterSupportComponent
    ],
    imports: [
        RouterModule.forChild(supportRouting),
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseAlertModule,
        SharedModule,
        MatSliderModule,
        MatProgressSpinnerModule
    ]
})
export class SupportModule
{
}
