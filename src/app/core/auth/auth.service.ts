import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import {User} from "../user/user.types";

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    private register = 'https://sduelection.kz/auth/register';
    private auth = 'https://sduelection.kz/auth/authenticate';
    private getById = 'https://sduelection.kz/users/';




    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);

    }
    set email(email: string)
    {
        localStorage.setItem('email', email);

    }
    set role(role: string)
    {
        localStorage.setItem('role', role);

    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(this.auth, credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage

                this.accessToken = response.token;
                this.email = response.email;
                this.role = response.role;

                console.log('accessToken',this.accessToken)

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if ( response.accessToken )
                {
                    this.accessToken = response.accessToken;
                    this.email = response.email;
                    this.role = response.role;
                }


                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; lastName: string; email: string; password: string; studentId: string;faculty: string; gender: string, course: string, role: { id: string } }): Observable<any> {
        console.log('this._httpClient.post(this.url, user)', this._httpClient.post(this.register, user));
        return this._httpClient.post(this.register, user);
    }


    createEvents(eventData: any): Observable<any> {
        return this._httpClient.post(`${this.getById}createEvents`, eventData);
    }
    saveCandidateForm(candidateData: any): Observable<any> {
        return this._httpClient.post(`${this.getById}save-candidate-file`, candidateData);
    }
    updateEvents(eventData: any): Observable<any> {
        return this._httpClient.put(`${this.getById}updateEvents`, eventData);
    }
    deleteEvent(id: string): Observable<any>{
        let number = id
        return this._httpClient.delete(`${this.getById}deleteEvent/${id}`)
    }
    getAllEvent(): Observable<any>{
        return this._httpClient.get(`${this.getById}getEvent`)
    }



    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    getUserById(userId: string): Observable<User> {
        return this._httpClient.get<User>(`https://sduelection.kz/users/${userId}`); // Предполагается, что у вас есть роутер API для получения пользователя по его идентификатору
    }

    updateUser(user: User): Observable<User> {
        return this._httpClient.post<User>(`https://sduelection.kz/users/${user.id}`, user);
    }
}
