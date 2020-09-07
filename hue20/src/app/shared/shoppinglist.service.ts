//alle meine Funktionen die sich auf auth beziehen
import { Injectable } from '@angular/core';
import {ShoppingList} from "./shopping-list";
import {Article} from "./article";
import {User} from "./user";
import {Observable, throwError} from "rxjs";
import { catchError , retry } from 'rxjs/operators' ;
import {Comment} from "./comment";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ShoppinglistService {

    // api - server url
    private api = 'http://coronahue.s1610456005.student.kwmhgb.at/api';

    constructor(private http: HttpClient) {
    }

    /**durch den service brauchts das getAll nur einmal und in komponenten greift man darauf zu
     * return all existing shopping_lists
     */
    getAll():Observable<Array<ShoppingList>> {
        return this.http.get(`${this.api}/shopping_lists`)
            .pipe(retry(3))
            .pipe(catchError(this.errorHandler));
    }


    /**
     * returns an existing shoppingList based on passed id
     * @param id
     */
    getSingle(id: number): Observable<ShoppingList> {
        return this.http.get(`${this.api}/shopping_lists/${id}`)
            .pipe(retry(3))
            .pipe(catchError(this.errorHandler));
    }

    /**
     * creates a new shoppingList
     * @param shoppingList
     */
    create(shoppingList: ShoppingList): Observable<ShoppingList> {
        console.log("HALLO1" ,shoppingList);
        return this.http.post(`${this.api}/shoppingList`, shoppingList)
            .pipe(retry(3))
            .pipe(catchError(this.errorHandler)
            );

    }

    /**
     * updates an existing shoppinglist
     * @param shoppingList
     */
    update(shoppinglist: ShoppingList): Observable<ShoppingList> {
        console.log("HALLO2" ,shoppinglist);
        return this.http.put(`${this.api}/shoppingList/${shoppinglist.id}`, shoppinglist)
            .pipe(retry(3))
            .pipe(catchError(this.errorHandler));
    }

    /**
     * updates an existing shoppinglist
     * @param shoppingList
     */
    remove(id: number): Observable<ShoppingList> {
        return this.http.delete(`${this.api}/shoppingList/${id}`)
            .pipe(retry(3))
            .pipe(catchError(this.errorHandler));
    }


    private errorHandler (error: Error | any): Observable<any> {
        return throwError (error);
    }
}
