import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GATEWAY} from "../constants/service.constants";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(private _httpClient: HttpClient)
  {
  }
  private readonly GENERAL = `${GATEWAY}/auth`;
  private url = 'http://localhost:8070/auth/get';

  getAllMembers(): Observable<any>{
    return this._httpClient.get<any>(this.url);
  }
}
