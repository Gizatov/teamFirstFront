import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {Observable} from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    registrationResponse$: Observable<any>;


    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        function specificEmailValidator(): ValidatorFn {
            return (control: AbstractControl): ValidationErrors | null => {
                const emailPattern = /^[0-9]{9}@stu\.sdu\.edu\.kz$/;
                const valid = emailPattern.test(control.value);
                return valid ? null : { specificEmail: true };
            };
        }

         function specificStudentIdValidator(): ValidatorFn {
            return (control: AbstractControl): ValidationErrors | null => {
                const studentIdPattern = /^2[0-9]{8}$/; // Начинается с 2 и имеет длину в 9 цифр
                const valid = studentIdPattern.test(control.value);
                return valid ? null : { specificStudentId: true };
            };
        }
        // Create the form
        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email, specificEmailValidator()]],
            password: ['', Validators.required],
            studentId: ['', [Validators.required, specificStudentIdValidator()]],
            faculty: ['', Validators.required],
            gender: [''],
            course: ['', Validators.required],
            role: ['', Validators.required]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */

    onSignUp(): void {
        if (this.signUpForm.valid) {
            const formData = this.signUpForm.value;
            const request = {
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                studentId: formData.studentId,
                faculty: formData.faculty,
                gender: formData.gender,
                course: formData.course,
                role: {
                    id: formData.role
                }
            };

            this._authService.signUp(request).subscribe(
                res => {
                    this.registrationResponse$ = res;
                    if (res.token) {
                        this._snackBar.open('Регистрация прошла успешно', 'OK', {
                            duration: 3000,
                        });
                        this.router.navigate(['/sign-in']);
                    }
                },
                error => {
                    if (error.status === 401) {
                        this._snackBar.open('Пользователь с такой почтой уже сущестует!', 'OK', {
                            duration: 3000,
                        });
                    } else {
                        this._snackBar.open('Произошла ошибка, попробуйте снова', 'OK', {
                            duration: 3000,
                        });
                    }
                }
            );
        }
    }



}
