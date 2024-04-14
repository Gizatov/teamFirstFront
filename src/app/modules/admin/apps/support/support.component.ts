import {Component, NgModule, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, NgForm, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {HelpCenterService} from 'app/modules/admin/apps/help-center/help-center.service';
import {MatNativeDateModule} from "@angular/material/core";
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
    selector: 'apps-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss']
})


export class HelpCenterSupportComponent implements OnInit {
    @ViewChild('supportNgForm') supportNgForm: NgForm;


    alert: any;
    supportForm: UntypedFormGroup;
    adminRegEventForm: UntypedFormGroup;
    private userRole: string;
    isCandidate: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _helpCenterService: HelpCenterService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the support form
        this.supportForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required]
        });
        this.userRole = localStorage.getItem('role');
        console.log('userRole: ', this.userRole)
        if (this.userRole == 'candidate') {
            this.isCandidate = true;

        }


        this.adminRegEventForm = this._formBuilder.group({
                dateRegStart: ['', Validators.required],
                dateRegEnd: ['', Validators.required],
                countCandidate: ['', [Validators.required, Validators.email]],
                dateEventStart: ['', Validators.required],
                dateEventEnd: ['', Validators.required],
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Clear the form
     */
    clearForm(): void {
        // Reset the form
        this.supportNgForm.resetForm();
    }

    /**
     * Send the form
     */
    sendForm(): void {
        // Send your form here using an http request
        console.log('Your message has been sent!');

        // Show a success message (it can also be an error message)
        // and remove it after 5 seconds
        this.alert = {
            type: 'success',
            message: 'Your request has been delivered! A member of our support staff will respond as soon as possible.'
        };

        setTimeout(() => {
            this.alert = null;
        }, 7000);

        // Clear the form
        this.clearForm();
    }

    onSignUp(): void {
        if (this.adminRegEventForm.valid) {
            const formData = this.adminRegEventForm.value;
            const request = {
                dateRegStart: formData.dateRegStart,
                dateRegEnd: formData.dateRegEnd,
                countCandidate: formData.countCandidate,
                dateEventStart: formData.dateEventStart,
                dateEventEnd: formData.dateEventEnd,

            };

            // this.authService.signUp(request).subscribe(res => {
            //     this.registrationResponse$ = res;
            //     console.log('res',res.status)
            //     if (res.token) {
            //         this._snackBar.open('Регистрация прошла успешно', 'OK', {
            //             duration: 3000,
            //         });
            //         this.close();
            //         window.location.reload();
            //     }
            // });
        }
    }

}
