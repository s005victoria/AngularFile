import {Component, OnInit} from '@angular/core' ;
import {FormBuilder, FormGroup, Validators} from '@angular/forms' ;
import {Router} from '@angular/router' ;
import {AuthenticationService} from "../shared/authentication.service" ;
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
//ist das body ergebnis genau wie im postman
interface Response {
    response: string;
    result: {
        token: string;
    };
}

@Component({
    selector: 'bs-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    //Name der Formgroup dass wir im HTML angeben
    loginForm: FormGroup;
    loggedIn: boolean;

    constructor(private fb: FormBuilder, private router: Router,
                private authService: AuthenticationService) {

    }

    ngOnInit(): void {
        //erste variable sagt, ob ich etwas reinschreiben möchte
        // zweite man kann beliebige Validatoren eingeben sowie das format
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    /**
     * login to app, if success the token is saved to the local storage
     */
    login() {
       /* this.loggedIn = true;
        var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9jb3JvbmFodWUuczE2MTA0NTYwMDUuc3R1ZGVudC5rd21oZ2IuYXRcL2FwaVwvYXV0aFwvbG9naW4iLCJpYXQiOjE1OTY4ODQyODAsImV4cCI6MTU5Njg4Nzg4MCwibmJmIjoxNTk2ODg0MjgwLCJqdGkiOiJHWTcweFNkZjlYem9NN2plIiwic3ViIjoyLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIiwidXNlciI6eyJpZCI6Miwidm9sdW50ZWVyIjoxfX0.jieelXmZlb7Utf6ONXn_IqjYSJ3ejvA-2t6xFYwS4rU";
        this.authService.setLocalStorage(token);
        this.router.navigateByUrl('/');*/

        const val = this.loginForm.value;
        if (val.email && val.password) {
            this.authService.login(val.email, val.password).subscribe(res => {
                //es ist typescript und wir brauchen response damit das richtig funktioniert
                //siehe postman ergebnis mit result und response
                const resObj = res as Response;
                if (resObj.response === "success") {
                    //authService ist der selbsterstellte service
                    //localstorage speichert die id des derzeit eingeloggten user
                    this.authService.setLocalStorage(resObj.result.token);
                    this.router.navigateByUrl('/');
                }
            });
        }
    }

    /**
     * check if user is logged in to show appropriate view of the login
     */
    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    /**
     * check if user is logged in as searcher
     */
    isLoggedInAsSearcher(){
        //TODO implement searcher login
        return this.authService.isLoggedIn();
    }


    /**
     * logout from the app
     */
    logout() {
        this.authService.logout();
    }
}