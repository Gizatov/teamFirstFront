import {Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, NgForm, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/auth/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
// import {KatoService} from "../../../../../../core/service/kato.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
// import {PasswordValidator} from "../../../../../../../@fuse/validators/password-validator";

@Component({
    selector: 'add-user-classic',
    templateUrl: './add-user.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    currentUser = null;
    emailExists: boolean = false;
    emailErrorMessage: string = "Такая электронная почта уже существует";
    roles: any[] = [];
    passCheck: boolean = false;
    regions: any;

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        // private _katoService: KatoService,
        @Optional() public dialogRef: MatDialogRef<AddUserComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {

        // this._katoService.getAll().subscribe(v => {
        //     this.regions = v.data;
        // })


        if (this.data == null) {
            this.currentUser = localStorage.getItem("REGISTRATION_FORM")
                ? JSON.parse(localStorage.getItem("REGISTRATION_FORM")) : null;
        } else {
            this.currentUser = {};
        }

        // this._authService.getRoles().subscribe((data: any[]) => {
        //     this.roles = data;
        // });


        // Create the form
        // this.signUpForm = this._formBuilder.group({
        //         step1: this._formBuilder.group({
        //             iin: [null, Validators.required],
        //             password: [null, PasswordValidator.passwordValidator()],
        //             email: [null, [Validators.required, Validators.email]],
        //             role: [null, Validators.required],
        //             bin: [null, [Validators.required]],
        //             position: [null]
        //         })
        //     }
        // );

        // this.checkEmail();

    }

    // checkEmailExistence(email: string): Observable<boolean> {
    //     return this._authService.checkEmailExistence(email);
    // }

    // checkEmail() {
    //     const emailControl = this.signUpForm.get('step1.email');
    //     this.checkEmailExistence(emailControl.value)
    //         .subscribe(response => {
    //             if (response) {
    //                 this.emailExists = response;
    //                 this.emailErrorMessage = "Такая электронная почта уже существует";
    //             } else {
    //                 this.emailExists = false;
    //             }
    //         });
    //     emailControl.valueChanges
    //         .pipe(
    //             debounceTime(500),
    //             distinctUntilChanged()
    //         )
    //         .subscribe(email => {
    //             if (email) {
    //                 this.checkEmailExistence(email)
    //                     .subscribe(response => {
    //                         if (response) {
    //                             this.emailExists = response;
    //                             this.emailErrorMessage = "Такая электронная почта уже существует";
    //                         } else {
    //                             this.emailExists = false;
    //                         }
    //                     });
    //             }
    //         });
    // }

    addUser(): void {
        let step1 = this.signUpForm.controls['step1'].value;
        let request = {
            iin: step1.iin,
            username: step1.iin,
            password: step1.password,
            emailAddress: step1.email,
            role: step1.role,
            bin: step1.bin,
            positionRuName: step1.position,
            positionKkName: step1.position,

            regionCode: null,
            schoolRuName: null,
            schoolKkName: null,
            lastName: null,
            middleName: null,
            firstName: null,
            birthDate: null,
            schoolId: null,
            areaCode: null,
            locationCode: null,
            orgType: null,
            educationAgencyId: null,
            educationAgencyLocationCode: null,
            educationAgencyType: null,
            eduAgencyPositionCode: null
        };

        // this._authService.addUser(request).subscribe(v => {
        //     if (v.id) {
        //         this._router.navigate(['/dashboards/user-management']);
        //         this._snackBar.open('Пользователь успешно добавлено!');
        //         localStorage.removeItem("REGISTRATION_FORM");
        //         this.dialogRef.close();
        //     } else {
        //         this._snackBar.open('Пользователь уже существует!');
        //     }
        // })
    }

    closeForm() {
        this.dialogRef.close();
    }
}
