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
  private url = 'https://sduelection.kz/auth/get';
  private deleteUrl = 'https://sduelection.kz/users/delete';

  getAllMembers(): Observable<any>{
    return this._httpClient.get<any>(this.url);
  }

  deleteById(id: string): Observable<any> {
    const deleteUrlWithId = `${this.deleteUrl}/${id}`;
    return this._httpClient.delete(deleteUrlWithId);
  }
}
