import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { AcademyService } from 'app/modules/admin/apps/academy/academy.service';
import { Category, Course } from 'app/modules/admin/apps/academy/academy.types';
import {MatTableDataSource} from "@angular/material/table";
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogService} from "../../../../core/service/dialog.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector       : 'finance',
    templateUrl    : './finance.component.html',
    styleUrls: ['./finance.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy
{
    categories: Category[];
    courses: Course[];
    displayedColumns: string[] = [ 'id','name', 'lastName','totalVote'];
    dataSource: MatTableDataSource<any>;
    dataS: any;
    size = 5;
    page = 0;
    total: any;
    array: any[];
    filteredCourses: Course[];
    currentUserVote: boolean  = false;
    errorOccurred: boolean = true;
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        categorySlug$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
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


        // Get the categories
        this._academyService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the courses
        this._academyService.courses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((courses: Course[]) => {
                this.courses = this.filteredCourses = courses;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Filter the courses
        combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([categorySlug, query, hideCompleted]) => {

                // Reset the filtered courses
                this.filteredCourses = this.courses;

                // Filter by category
                if ( categorySlug !== 'all' )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.category === categorySlug);
                }

                // Filter by search query
                if ( query !== '' )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.title.toLowerCase().includes(query.toLowerCase())
                        || course.description.toLowerCase().includes(query.toLowerCase())
                        || course.category.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                if ( hideCompleted )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.progress.completed === 0);
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.filters.query$.next(query);
    }

    /**
     * Filter by category
     *
     * @param change
     */
    filterByCategory(change: MatSelectChange): void
    {
        this.filters.categorySlug$.next(change.value);
    }

    /**
     * Show/hide completed courses
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void
    {
        this.filters.hideCompleted$.next(change.checked);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
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
                    window.location.reload();
                } else {
                    this._snackBar.open('Что то пошло не так.', 'Закрыть', {
                        duration: 3000,
                    });
                }
            });

    }

    ngAfterViewInit(): void {
    }

}
