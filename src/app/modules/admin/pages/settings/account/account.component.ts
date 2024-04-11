import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    private userEmail: string;
    private userRole: string;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userEmail = localStorage.getItem('email');
        this.userRole = localStorage.getItem('role');
        // Create the form
        this.accountForm = this._formBuilder.group({
            name    : ['Gizatov Arnur'],
            username: [this.userEmail],
            Role   : [this.userRole],
            Course : ['4'],
            about   : ['Hey! This is Brian; husband, father and gamer. I\'m mostly passionate about bleeding edge tech and chocolate! 🍫'],
            email   : [this.userEmail, Validators.email],
            id   : ['200103128'],
            country : ['usa'],
            language: ['english']
        });
    }
}
