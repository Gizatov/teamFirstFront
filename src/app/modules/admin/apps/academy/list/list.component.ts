import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSelectChange} from '@angular/material/select';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil, timer} from 'rxjs';
import {AcademyService} from 'app/modules/admin/apps/academy/academy.service';
import {Category, Course} from 'app/modules/admin/apps/academy/academy.types';
import {MatTableDataSource} from "@angular/material/table";
import {DialogService} from "../../../../../core/service/dialog.service";
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../../../core/auth/auth.service";

@Component({
    selector: 'academy-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
})
export class AcademyListComponent implements OnInit, OnDestroy {
    categories: Category[];
    courses: Course[];
    filteredCourses: Course[];
    countdownString$: Observable<string>;
    eventId: any;
    registrationStart: any;
    registrationEnd: any;
    private targetDate: Date;
    persons: any;
    choiceStart: any;
    choiceEnd: any;
    currentUserVote: boolean = false;
    isExist: any;
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        categorySlug$: new BehaviorSubject('all'),
        query$: new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    dataSource: any[];
    show: boolean = false;
    noCandidate: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private authService: AuthService,
        private dialogService: DialogService,
        private _snackBar: MatSnackBar,
        private _academyService: AcademyService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._academyService.checkIfCurrentUserExists().subscribe({
            next: (response: { isExist: boolean }) => {
                // Установка значения currentUserVote в зависимости от результата запроса
                this.currentUserVote = response.isExist;
                this._changeDetectorRef.detectChanges();
                // Обработка ошибки
            },
            error: error => {
                console.error('Ошибка при проверке существования пользователя:', error);
                // Обработайте ошибку здесь
            }
        });


        this._academyService.getAllCandidates().subscribe((data: any[]) => {
            this.dataSource = data;
            console.log('asd',data)
            this.show = true;
            this.cdr.detectChanges();
            console.log('show', this.show)

            if (data[0] == null){
                this.noCandidate = true;
                this._changeDetectorRef.detectChanges();
                console.log('this.noCandidate' , this.noCandidate)
            }
            // this.dataSource.paginator = this.paginator;
            // this.loading = false;
        });


        this.authService.getAllEvent().subscribe(
            data => {
                this.eventId = data[0].id;
                this.registrationStart = data[0].registrationStart;
                this.registrationEnd = data[0].registrationEnd;
                this.persons = data[0].persons;
                this.choiceStart = data[0].choiceStart;
                this.choiceEnd = data[0].choiceEnd;

                console.log('Received choiceEnd:', this.choiceEnd);

                // Преобразуем строку в объект Date
                this.targetDate = new Date(this.choiceEnd);
                console.log('Formatted targetDate:', this.targetDate);

                // Проверка на валидность даты
                if (isNaN(this.targetDate.getTime())) {
                    throw new Error('Invalid date format');
                }
                this.initializeCountdown();


                // Запускаем детектирование изменений, если необходимо
                this._changeDetectorRef.detectChanges();
            },
            error => {
                console.error('Error fetching events:', error);
            }
        );


    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    initializeCountdown(): void {
        this.countdownString$ = timer(0, 1000).pipe(
            map(() => {
                // Получаем текущую дату и время
                const currentDate = new Date().getTime();

                // Рассчитываем разницу между текущей и целевой датой
                const timeDiff = this.targetDate.getTime() - currentDate;

                console.log('Current timestamp:', currentDate);
                console.log('Time difference:', timeDiff);

                // Проверяем, что оставшееся время положительное
                if (timeDiff > 0) {
                    // Рассчитываем оставшееся время в днях, часах, минутах и секундах
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                    // Формируем строку для отображения оставшегося времени
                    return `${days} дней ${hours} часов ${minutes} минут ${seconds} секунд`;
                } else {
                    // Если целевая дата прошла, выводим сообщение
                    return 'Целевая дата прошла';
                }
            })
        );
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openRegDialog() {
        this.dialogService.openCandidateInfoModal();
    }


    voteForCandidate(candidateId: number): void {
        this._academyService.voteForCandidate(candidateId)
            .subscribe((response: any) => {
            }, (error) => {
                console.error('Ошибка при отправке голоса:', error);
                if (error.status === 200) {
                        this._snackBar.open('Голос за кандидата успешно засчитан.', 'Закрыть', {
                            duration: 3000,
                        });
                        this.currentUserVote = true;
                        this.cdr.detectChanges();
                    } else {
                        this._snackBar.open('Что то пошло не так.', 'Закрыть', {
                            duration: 3000,
                        });
                }
            });

    }

}
