import { Injectable } from '@angular/core';
import {map, Observable, ReplaySubject, tap} from "rxjs";
import {User} from "../user/user.types";
import {HttpClient} from "@angular/common/http";
import {PeriodicElement} from "../model/periodic-element.types";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private _tableData: ReplaySubject<PeriodicElement[]> = new ReplaySubject<PeriodicElement[]>(1);

  constructor(private _httpClient: HttpClient)
  {
  }

  set tableData(value: PeriodicElement[])
  {
    this._tableData.next(value);
  }

  get tableData$(): Observable<PeriodicElement[]>
  {
    return this._tableData.asObservable();
  }

  getTableData(): Observable<PeriodicElement[]> {
    return this._httpClient.get<PeriodicElement[]>('api/common/tableData').pipe(
        tap((tableData) => {
          this._tableData.next(tableData);
        })
    );
  }
}
