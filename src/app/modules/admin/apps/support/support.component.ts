import {Component, NgModule, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {HelpCenterService} from 'app/modules/admin/apps/help-center/help-center.service';
import {AuthService} from "../../../../core/auth/auth.service";
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'apps-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss'],
    providers: [DatePipe]
})


export class HelpCenterSupportComponent implements OnInit {
    @ViewChild('supportNgForm') supportNgForm: NgForm;
    userForm: FormGroup;

    alert: any;
    registrationStart: any;

    choiceEndUpdate:any;
    choiceStartUpdate:any;
    personsExceeded: boolean = false;
    personsUpdate:any;
    registrationEndUpdate:any;
    regStartUpdate:any;
    eventExist: boolean = false;




    eventId: any;
    registrationEnd: any;
    persons: any;
    choiceStart: any;
    choiceEnd: any;
    isEditing: boolean = false;

    supportForm: UntypedFormGroup;
    adminRegEventForm: UntypedFormGroup;
    candidateForm: UntypedFormGroup;
    adminEvent: UntypedFormGroup;
    userRole: string;
    isCandidate: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private authService: AuthService,
        private _snackBar: MatSnackBar,
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
        this.getAllEvents();
        // Create the support form
        this.userRole = localStorage.getItem('role');
        console.log('userRole: ', this.userRole)



        this.adminRegEventForm = this._formBuilder.group({
                dateRegStart: ['', Validators.required],
                dateRegEnd: ['', Validators.required],
                countCandidate: ['',Validators.required],
                dateEventStart: ['', Validators.required],
                dateEventEnd: ['', Validators.required],
            }
        );
        this.userForm = this._formBuilder.group({
            photo: [null, Validators.required],
            about: ['', Validators.required],
            gpa: ['', [Validators.required, Validators.pattern('^[0-4](\\.\\d{1,2})?$')]], // GPA от 0.00 до 4.00
            awards: ['', Validators.required],
            clubs: ['', Validators.required]
        });




        // this.adminEvent = this._formBuilder.group({
        //     registrationStart: [''],
        //     registrationEnd: [''],
        //     persons: [''],
        //     choiceStart: [''],
        //     choiceEnd: [''],
        //     }
        // );



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
    getAllEvents(): void {
        this.authService.getAllEvent().subscribe(
            data => {
                this.eventId = data[0].id;
                this.registrationStart = this.formatDate(data[0].registrationStart);
                this.registrationEnd = this.formatDate(data[0].registrationEnd);
                this.persons= data[0].persons;
                this.choiceStart = this.formatDate(data[0].choiceStart);
                this.choiceEnd = this.formatDate(data[0].choiceEnd);
                this.isCandidate = true;

                if (data[0].id != null){
                    this.eventExist = true;
                }

                console.log( 'data.registrationStart', data[0].registrationStart);
            }
        );
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

    saveCandidateForm(): void{
        if (this.userForm.valid) {
            const formData = this.userForm.value;
            const request = {
                photo: formData.photo,
                about: formData.about,
                gpa: formData.gpa,
                awards: formData.awards,
                clubs: formData.clubs,
            };
            this.authService.saveCandidateForm(request).subscribe(
                response =>{
                    if (response.status === '200'){
                        this._snackBar.open('Файлы успешно сохронены', 'Закрыть', {
                            duration: 3000,
                        });
                    } else {
                        this._snackBar.open('Файлы успешно сохронены', 'Закрыть', {
                            duration: 3000,
                        });
                    }
                    console.log('candidate files successfully uploaded', response);

                    // Обновление страницы через 1 секунду после закрытия Snackbar
                    setTimeout(() => {
                        location.reload();
                    }, 1000); // 3000 мс (длительность Snackbar) + 1000 мс (1 секунда задержки)
                }
            );
        }

    }

    createEvent(): void {
        if (this.adminRegEventForm.valid) {
            const formData = this.adminRegEventForm.value;
            const request = {
                dateRegStart: formData.dateRegStart,
                dateRegEnd: formData.dateRegEnd,
                countCandidate: formData.countCandidate,
                dateEventStart: formData.dateEventStart,
                dateEventEnd: formData.dateEventEnd,
            };

            this.authService.createEvents(request).subscribe(
                response => {
                    if (response.status === '200'){
                        this._snackBar.open('Выборы успешно созданы', 'Закрыть', {
                            duration: 3000,
                        });
                    } else {
                        this._snackBar.open('Выборы успешно созданы', 'Закрыть', {
                            duration: 3000,
                        });
                    }
                    console.log('Event created successfully', response);

                    // Обновление страницы через 1 секунду после закрытия Snackbar
                    setTimeout(() => {
                        location.reload();
                    }, 1000); // 3000 мс (длительность Snackbar) + 1000 мс (1 секунда задержки)
                }
            );

        }
    }
    onSave(eventId: string) {
        const updatedData = {
            eventId: eventId,
            regStartUpdate: this.regStartUpdate ? this.datePipe.transform(this.regStartUpdate, 'yyyy-MM-dd') : null,
            registrationEndUpdate: this.registrationEndUpdate ? this.datePipe.transform(this.registrationEndUpdate, 'yyyy-MM-dd') : null,
            personsUpdate: this.personsUpdate,
            choiceStartUpdate: this.choiceStartUpdate ? this.datePipe.transform(this.choiceStartUpdate, 'yyyy-MM-dd') : null,
            choiceEndUpdate: this.choiceEndUpdate ? this.datePipe.transform(this.choiceEndUpdate, 'yyyy-MM-dd') : null
        };
        this.authService.updateEvents(updatedData)
            .subscribe(
                response => {
                    console.log('Data updated successfully', response);
                    if (response.status == '200'){
                        this._snackBar.open('Выборы изменены', 'Закрыть', {
                            duration: 3000,
                        });
                    }else {
                        this._snackBar.open('Выборы изменены', 'Закрыть', {
                            duration: 3000,
                        });
                    }
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                    this.isEditing = false;
                }
            );
    }

    onDelete(id: string): void {
        this.authService.deleteEvent(id).subscribe(
            response =>{
                if (response.status == '200'){
                    this._snackBar.open('Выборы удалены', 'Закрыть', {
                        duration: 3000,
                    });
                }else {
                    this._snackBar.open('Выборы удалены', 'Закрыть', {
                        duration: 3000,
                    });
                }
                setTimeout(() => {
                    location.reload();
                }, 500);

            }
        )

    }

    onEdit() {
        this.isEditing = true;
    }
    onCancel() {
        this.isEditing = false;
        this.getAllEvents();; // Reload original data
    }
    formatDate(date: string): string {
        return this.datePipe.transform(date, 'dd MMMM yyyy');
    }
    checkPersons() {
        if (this.personsUpdate > this.persons || this.personsUpdate < 0) {
            this.personsExceeded = true;
            this.personsUpdate = null; // Обнуляем значение, если оно превышает 10 или меньше 0
        } else {
            this.personsExceeded = false;
        }
    }
    onSubmit(): void {
        if (this.userForm.valid) {
            console.log(this.userForm.value);
        }
    }
}
