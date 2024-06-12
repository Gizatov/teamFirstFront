import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {AnalyticsService} from "../dashboards/analytics/analytics.service";
import {ApexOptions} from "ng-apexcharts";
import {AcademyService} from "../apps/academy/academy.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
    data: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    stats$: Observable<any>;

    mp = new Map();
    chartVisitors: ApexOptions;
    chartConversions: ApexOptions;
    chartImpressions: ApexOptions;
    chartVisits: ApexOptions;
    chartVisitorsVsPageViews: ApexOptions;
    chartNewVsReturning: ApexOptions;
    chartGender: ApexOptions;
    chartAge: ApexOptions;
    chartLanguage: ApexOptions;
    currentUserVote: any;

    statistic: any;


    female: any;

    /**
     * Constructor
     */
    constructor(
        private _analyticsService: AnalyticsService,
        private _academyService: AcademyService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        this._analyticsService.getStatistics()
            .subscribe(statistic => {
                this.statistic = statistic;
                console.log('statistic', statistic)
                this.female = statistic.female;

            });

        // Get the data
        this._analyticsService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                this.data = data;

                // Prepare the chart data

            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    attachFile(files: FileList) {
        console.log(files.item(0));
        const formData: FormData = new FormData();
        formData.append('file', files.item(0));
    }

    navigate1() {
        this._router.navigateByUrl(`/apps/academy`);
    }

    navigate2() {
        this._router.navigateByUrl(`/dashboards/analytics`);
    }

    navigate3() {
        this._router.navigateByUrl(`/dashboards/finance`);
    }

    navigate4() {
        this._router.navigateByUrl(`/pages/settings`);
    }

}
