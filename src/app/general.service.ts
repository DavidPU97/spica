import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
// @ts-ignore
import { Observable, throwError, Subject } from 'rxjs';
import { AbsenceDefinition, Absence, User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  apiAuthUrl: string = 'https://login.allhours.com/connect/token';
  apiUrl:string = 'https://api4.allhours.com/';

  tokenValidity: Subject<boolean> = new Subject<boolean>();
  usersListener: Subject<User[]> = new Subject<User[]>();
  userAdded: Subject<User> = new Subject<User>();
  errorListener: Subject<string> = new Subject<string>();
  absenceDefinitionsListener: Subject<AbsenceDefinition[]> = new Subject<AbsenceDefinition[]>();
  absenceListener: Subject<Absence[]> = new Subject<Absence[]>();
  absenceAdded: Subject<Absence> = new Subject<Absence>();

  users: User[] = [];
  absenceDefinitions: AbsenceDefinition[] = [];
  absences: Absence[] = [];

  /* API CALLS */

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

  // USERS

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

  addUser(user: User) {
		const usersURL = this.apiUrl+'api/v1/Users';
		const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer '+localStorage.getItem('authToken')!
      })
    };
    let body = {
      FirstName: user.name,
      LastName: user.lastname,
      Email: user.email
    }

    console.log(body)

		this.http.post(usersURL, body, httpOptions)
			.pipe(catchError(this.handleError))
			.subscribe({
				next: (result: any) => {
					// if(result.status){
						//push the location to the list
            console.log(result)
						let new_user = new User(user.name, user.lastname, user.email);
						this.pushUser(new_user);
					// }
				},
				error: (err:any) => {
          // alert(err)
          this.errorListener.next(err)
				}
			});
	}

  // ABSENCES

  fetchAbsenceDefinitions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer '+localStorage.getItem('authToken')!
      })
    };
    const usersURL = this.apiUrl+'api/v1/AbsenceDefinitions';
    this.http.get(usersURL, httpOptions).pipe(
        catchError(this.handleError) // then handle the error
      ).subscribe({
        next: (res:any) => {
          console.log(res)
          this.convertAbsenceDefinitions(res)
          this.absenceDefinitionsListener.next(this.absenceDefinitions)
        }
      });
  }

  fetchAbsences() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer '+localStorage.getItem('authToken')!
      })
    };
    const usersURL = this.apiUrl+'api/v1/Absences';
    this.http.get(usersURL, httpOptions).pipe(
        catchError(this.handleError) // then handle the error
      ).subscribe({
        next: (res:any) => {
          // this.convertUsers(res)
          // this.usersListener.next(this.users)
          console.log(res)
          this.convertAbsences(res)
          this.absenceListener.next(this.absences)
        }
      });
  }

  addAbsence(absence:Absence){
    const usersURL = this.apiUrl+'api/v1/Absences';
		const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer '+localStorage.getItem('authToken')!
      })
    };
    let body = {
      AbsenceDefinitionId: absence.absenceId,
      UserId: absence.employeeId,
      Comment: absence.comment,
      PartialTimeFrom: absence.dateStart.toISOString(),
      PartialTimeTo: absence.dateEnd.toISOString(),
      Timestamp: new Date(Date.now()).toISOString()
    }

    console.log(body)
		this.http.post(usersURL, body, httpOptions)
			.pipe(catchError(this.handleError))
			.subscribe({
				next: (result: any) => {
          let new_absence = new Absence(absence.absenceId, absence.employeeId, absence.comment, absence.dateStart, absence.dateEnd);
          this.absenceAdded.next(new_absence);
          console.log(result)
				},
				error: (err:any) => {
          // alert(err)
          this.errorListener.next(err)
				}
    });
  }


  /* OTHER FUNCTIONS */

  // send users to component
  getUsers(){
    return this.users.slice();
  }

  pushUser(new_user: User){
    this.userAdded.next(new_user);
  }

  getAbsenceDefinitions(){
    return this.absenceDefinitions.slice();
  }

  getAbsences(){
    return this.absences.slice();
  }

  // toggle token alert component when obtaining auth token
  sendTokenBool(validToken:boolean){
    this.tokenValidity.next(validToken)
  }


  convertUsers(res:any){
    this.users = [];
    res.forEach((user:any) => {
      this.users.push(new User(user.FirstName, user.LastName, user.Email, user.Id))
    });
  }

  convertAbsenceDefinitions(res:any){
    this.absenceDefinitions = [];
    res.forEach((ad:any) => {
      this.absenceDefinitions.push(new AbsenceDefinition(ad.Name, ad.Id))
    });
  }

  convertAbsences(res:any){
    this.absences = [];
    res.forEach((absence:any) => {
      this.absences.push(new Absence(absence.AbsenceDefinitionId, absence.UserId, absence.Comment, absence.PartialTimeFrom, 
        absence.PartialTimeTo, absence.Id))
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
    return throwError(() => new Error(error.error.error));
  }
}
