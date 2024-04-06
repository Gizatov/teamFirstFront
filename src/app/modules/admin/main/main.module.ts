import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import {RouterModule} from "@angular/router";
import {mainRoutes} from "./main-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatListModule} from "@angular/material/list";
import {EditUserComponent} from "../pages/edit-user.component/edit-user.component";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    MainComponent
  ],
    imports: [
        RouterModule.forChild(mainRoutes),
        SharedModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatButtonModule
    ]
})
export class MainModule { }
