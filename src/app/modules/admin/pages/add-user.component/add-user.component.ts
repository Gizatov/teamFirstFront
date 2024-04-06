import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../../core/auth/auth.service";
import { User } from "../../../../core/user/user.types";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
    user: User;
    signUpForm: UntypedFormGroup;
    registrationResponse$: Observable<any>;
    showAlert: boolean = false;
    constructor(
        private router: Router,
        private authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AddUserComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: { userId: string }
    ) {}

    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
                name: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required],
                gender: [''],
                role: ['', Validators.required]
            }
        );
    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges() {

    }

    onSignUp(): void {
        if (this.signUpForm.valid) {
            const formData = this.signUpForm.value;
            const request = {
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                gender: formData.gender,
                role: {
                    id: formData.role
                }
            };

            this.authService.signUp(request).subscribe(res => {
                this.registrationResponse$ = res;
                console.log('res',res.status)
                if (res.token) {
                    this._snackBar.open('Регистрация прошла успешно', 'OK', {
                        duration: 3000,
                    });

                    this.router.navigate(['/main']);
                }
            });
        }
    }
}
