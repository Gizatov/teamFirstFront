import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil, timer} from 'rxjs';
import { AcademyService } from 'app/modules/admin/apps/academy/academy.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogService} from "../../../../core/service/dialog.service";
import {MatPaginator} from "@angular/material/paginator";
import {AuthService} from "../../../../core/auth/auth.service";

@Component({
    selector       : 'finance',
    templateUrl    : './finance.component.html',
    styleUrls: ['./finance.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceComponent implements OnInit
{

    displayedColumns: string[] = [ 'id','name', 'lastName','totalVote'];
    dataSource: MatTableDataSource<any>;
    dataS: any;
    countdownString$: Observable<string>;
    size = 5;
    page = 0;
    total: any;
    eventId: any;
    registrationStart: any;
    registrationEnd: any;
    persons: any;
    choiceStart: any;
    choiceEnd: any;
    currentUserVote: boolean  = false;
    errorOccurred: boolean = true;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private targetDate: Date;
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        // private datePipe: DatePipe,
        private authService: AuthService,
        private dialogService: DialogService,
        private _snackBar: MatSnackBar,
        private _academyService: AcademyService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    private candidateName: any;

    /**
     * On init
     */
    ngOnInit(): void
    {
        // getAllEvents(): void {
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
    // }
        console.log('this.choiceEnd',this.choiceEnd)

        this._academyService.getFinalResult().subscribe(
            (data: any[]) => {
                this.dataSource = new MatTableDataSource<any>(data);
                this.dataSource.paginator = this.paginator;
            });


        this._academyService.checkIfCurrentUserExists().subscribe(
            (response: { isExist: boolean }) => {
                // Установка значения currentUserVote в зависимости от результата запроса
                this.currentUserVote = response.isExist;
                this.errorOccurred = this.currentUserVote;


                // Обработка ошибки
            },
            error => {
                console.error('Ошибка при проверке существования пользователя:', error);
                // Обработайте ошибку здесь
            }
        );


        this._academyService.getChoiceCandidates().subscribe((data: any) => {
            this.dataS = data;
            // this.dataSource.paginator = this.paginator;
            // this.loading = false;
        });
        console.log('Formatted targetDate timestamp:', this.targetDate);


        // Создаем Observable, который генерирует событие каждую секунду

    }
    openRegDialog() {
        this.dialogService.openCandidateInfoModal();
    }
    initializeCountdown(): void {
        this.countdownString$ = timer(0, 1000).pipe(
            map(() => {
                // Получаем текущую дату и время
                const currentDate = new Date().getTime();

                // Рассчитываем разницу между текущей и целевой датой
                const timeDiff = this.targetDate.getTime() - currentDate;

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


    voteForCandidate(candidateId: number): void {
        this._academyService.voteForCandidate(candidateId)
            .subscribe((response: any) => {
            }, (error) => {
                console.error('Ошибка при отправке голоса:', error);
                if (error.status === 200) {
                    this._snackBar.open('Голос за кандидата успешно засчитан.', 'Закрыть', {
                        duration: 3000,
                    });
                    window.location.reload();
                } else {
                    this._snackBar.open('Что то пошло не так.', 'Закрыть', {
                        duration: 3000,
                    });
                }
            });

    }

}
