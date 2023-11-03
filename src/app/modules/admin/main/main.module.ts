import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import {RouterModule} from "@angular/router";
import {mainRoutes} from "./main-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";


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
        MatInputModule
    ]
})
export class MainModule { }
