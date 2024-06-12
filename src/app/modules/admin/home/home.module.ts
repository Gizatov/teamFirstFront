import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {HomeComponent} from "./home.component";
import {homeRoutes} from "./home-routing.module";


@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        RouterModule.forChild(homeRoutes),
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
export class HomeModule { }
