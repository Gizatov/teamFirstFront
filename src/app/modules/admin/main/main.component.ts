import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {catchError, EMPTY, Subject, takeUntil, throwError, timeout} from "rxjs";
import {PeriodicElement} from "../../../core/model/periodic-element.types";
import {MainService} from "../../../core/service/main.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
  displayedColumnsForFilter: string[] = this.displayedColumns.map(col => '_' + col);
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<PeriodicElement>();
  loading: boolean = false;
  filterValues: { [key: string]: string } = {};

  constructor(private _mainService: MainService) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Items per page:';
    // Subscribe to user changes
    this.loading = true;
    this._mainService.getTableData()
        .pipe(
            takeUntil(this._unsubscribeAll),
            catchError((error: any) => {
              console.error('Произошла ошибка при получении данных:', error);
              this.loading = false;
              return EMPTY;
            })
        )
        .subscribe((periodicElement: PeriodicElement[]) => {
          if (periodicElement) {
            this.dataSource.data = periodicElement;
            this.loading = false;
          }
        });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleFilterValue(column: string, $event: any) {
    const filterValue = $event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
