import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
// @ts-ignore
import { Observable, throwError, Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  apiAuthUrl: string = 'https://login.allhours.com/connect/token';
  apiUrl:string = 'https://api4.allhours.com/';

  tokenValidity: Subject<boolean> = new Subject<boolean>();
  usersListener: Subject<User[]> = new Subject<User[]>();

  users: User[] = [];

  // Authorisation token
  getAuthToken(c_id: string, c_secret:string): Observable<any> {
    const body = new HttpParams()
        .set('grant_type', 'client_credentials')
        .set('scope', 'api')
        .set('client_id', c_id)
        .set('client_secret', c_secret);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };

    return this.http.post(this.apiAuthUrl, body, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // get all users from api
  fetchUsers() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer '+localStorage.getItem('authToken')!
      })
    };
    const usersURL = this.apiUrl+'api/v1/Users';
    this.http.get(usersURL, httpOptions).pipe(
        catchError(this.handleError) // then handle the error
      ).subscribe({
        next: (res:any) => {
          this.convertUsers(res)
          this.usersListener.next(this.users)
        }
      });
  }

  // send users to component
  getUsers(){
    return this.users.slice();
  }

  // toggle token alert component when obtaining auth token
  sendTokenBool(validToken:boolean){
    this.tokenValidity.next(validToken)
  }


  convertUsers(res:any){
    this.users = [];
    res.forEach((user:any) => {
      this.users.push(new User(user.FirstName, user.LastName, user.Email))
    });
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
