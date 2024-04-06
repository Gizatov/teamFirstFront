import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {Observable} from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';


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
        // Create the form
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    // signUp(): void {
    //     // Do nothing if the form is invalid
    //     if (this.signUpForm.invalid) {
    //         return;
    //     }
    //
    //     // Disable the form
    //     this.signUpForm.disable();
    //
    //     // Hide the alert
    //     this.showAlert = false;
    //
    //     // Sign up
    //     this._authService.signUp(this.signUpForm.value)
    //         .subscribe(
    //             (response) => {
    //
    //                 // Navigate to the confirmation required page
    //                 this._router.navigateByUrl('/confirmation-required');
    //             },
    //             (response) => {
    //
    //                 // Re-enable the form
    //                 this.signUpForm.enable();
    //
    //                 // Reset the form
    //                 this.signUpNgForm.resetForm();
    //
    //                 // Set the alert
    //                 this.alert = {
    //                     type: 'error',
    //                     message: 'Something went wrong, please try again.'
    //                 };
    //
    //                 // Show the alert
    //                 this.showAlert = true;
    //             }
    //         );
    // }

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

            this._authService.signUp(request).subscribe(res => {
                this.registrationResponse$ = res;
                console.log('res',res.status)
                if (res.token) {
                    this._snackBar.open('Регистрация прошла успешно', 'OK', {
                        duration: 3000,
                    });

                    this.router.navigate(['/sign-in']);
                }
            });
        }
    }



}
