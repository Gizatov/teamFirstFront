import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../../../../core/auth/auth.service";
import { User } from "../../../../core/user/user.types";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
     user: User;
    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { userId: string }
    ) {}

    ngOnInit(): void {
        // Теперь вы можете использовать this.data.userId для доступа к userId
        console.log('userId:', this.data.userId);
        this.authService.getUserById(this.data.userId).subscribe(user => {
                this.user = user;
            });
    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges() {

    }
}
