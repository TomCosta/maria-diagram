import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { OrgItem, OrgLink } from '../models/diagram';
import { AuthService } from '../auth/auth.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DiagramService {

    private saveSource = new BehaviorSubject(null);
    diagramSource = this.saveSource.asObservable();

    endpoint: string = 'http://localhost:4000/api';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private auth: AuthService,
        private http: HttpClient,
        public router: Router
    ){      
    }

    buttonToSave(message: string){
        this.saveSource.next(message);
    }
    
    loadDG(){
        return this.http.get(`${this.endpoint}/diagram`, {headers:this.headers})
        .pipe(
            map((res: Response) => {
              return res || {}
            })
        )
    }
    
    saveDG(id, orgItems: Array<OrgItem>, orgLinks: Array<OrgLink>): Observable<any> {
        let body = {id : id, orgItem:orgItems, orgLink:orgLinks };
        return this.http.post(`${this.endpoint}/diagram`, JSON.stringify(body), {headers:this.headers})
        .pipe(
            catchError(this.handleError)
        )
    }

    deleteDG(id): Observable<any> {
        return this.http.delete(`${this.endpoint}/delete/${id}`, {headers:this.headers})
        .pipe(
            catchError(this.handleError)
        )
    }

    // Error 
    handleError(error: HttpErrorResponse) {
        console.log('Api Error: ', error?.error);
        let msg = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(msg);
    }
}