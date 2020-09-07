//kommuniziert man mit dem server (schnittstelle zwischen server und client)
import {Injectable} from '@angular/core' ;
import {HttpClient} from "@angular/common/http" ;
import * as decode from 'jwt-decode' ;
import {retry} from 'rxjs/operators' ;

interface User {
    result: {
        created_at: Date,
        email: string,
        id: number,
        name: string,
        updated_at: Date
    }
}

@Injectable()

export class AuthenticationService {
    private api: string = 'http://coronahue.s1610456005.student.kwmhgb.at/api/auth';

    constructor(private http: HttpClient) {
    }

    /**
     * login via REST-interface.. post is used to deliver the login-data to server
     * @param email
     * @param password
     */
    login(email: string, password: string) {
        return this.http.post(`${this.api}/login`, {
            'email': email,
            'password': password
        });
    }

    /**
     * get current user
     */
    public setCurrentUserId() {
        this.http.get <User>(`${this.api }/user`).pipe(retry(3)).subscribe(res => {
                localStorage.setItem('userId', res.result.id.toString());
            }
        );
    }

    /**
     * get current user through the localstorage
     */
    public getCurrentUserId() {
        return Number.parseInt(localStorage.getItem('userId'));
    }

    /**
     * return true if current loging user is a volunteer
     * @return boolean
     */
    public isCurrentUserVolunteer(){
        return Number.parseInt(localStorage.getItem('isVolunteer'))==1;
    }

    /**
     * token and userid is set to the local storage
     * saves the data of the current loginuser
     * @param token
     */
    public setLocalStorage(token: string) {
        console.log ( "Storing token" );

        //haben wir uns importiert über das npm
        const decodedToken = decode(token);

        console.log (decodedToken.user.id );
        localStorage.setItem('token', token);
        localStorage.setItem('userId', decodedToken.user.id);
        localStorage.setItem('isVolunteer', decodedToken.user.volunteer);
    }

    logout () {
        this.http. post ( ` ${this. api } /logout` , {});
        localStorage . removeItem ( "token" );
        localStorage . removeItem ( "userid" );
        console. log ( "logged out" );
    }



    /**
     * checks if the user is logged in through the data of the local storage
     */
    public isLoggedIn() {
        if (localStorage.getItem("token")) {
            let token: string = localStorage.getItem("token");
            const decodedToken = decode(token);
            let expirationDate: Date = new Date(0);
            //das exp kommt vom decoded jwt, kann man sich auch visuell anschauen über die Seite wo der decoded token angezeigt wird
            expirationDate.setUTCSeconds(decodedToken.exp);
            if (expirationDate < new Date()) {
                localStorage.removeItem("token");
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * checks if the user is logged in through the data of the local storage
     */

    public isLoggedInAsSearcher() {
        if (localStorage.getItem("token")) {
            let token: string = localStorage.getItem("token");
            const decodedToken = decode(token);
            let expirationDate: Date = new Date(0);
            //das exp kommt vom decoded jwt, kann man sich auch visuell anschauen über die Seite wo der decoded token angezeigt wird
            expirationDate.setUTCSeconds(decodedToken.exp);
            if (expirationDate < new Date()) {
                localStorage.removeItem("token");
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * check if user is logged out
     */
    isLoggedOut() {
        return !this.isLoggedIn();
    }
}


