import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {EditUserComponent} from "../../modules/admin/pages/edit-user.component/edit-user.component";
import {AddUserComponent} from "../../modules/admin/pages/add-user.component/add-user.component";
import {CandidateInfoComponent} from "../../modules/admin/pages/candidate-info.component/candidate-info.component";

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(private dialog: MatDialog) { }

    openEditUserModal(userId: string): void {
        this.dialog.open(EditUserComponent, {
            width: '600px', // Установите размер модального окна по вашему усмотрению
            data: { userId: userId }
        });
    }
    openAddUserModal(): void {
        this.dialog.open(AddUserComponent, {
            width: '600px', // Установите размер модального окна по вашему усмотрению
        });
    }
    openCandidateInfoModal(): void {
        this.dialog.open(CandidateInfoComponent, {
            width: '600px', // Установите размер модального окна по вашему усмотрению
        });
    }
}
