import { Component } from '@angular/core';
import {AuthenticationService} from "./shared/authentication.service";

@Component({
    selector: 'bs-root',
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {

    constructor(public authService:AuthenticationService){}

    isLoggedIn(){
        return this.authService.isLoggedIn();
    }

    isLoggedInAsSearcher(){
        return this.authService.isLoggedIn();
    }

    getLoginLabel(){
        if(this.isLoggedIn()){
            return "Logout";
        }else{
            return "Login";
        }
    }

    showResponsiveMenu(){
        var x = document.getElementById("topNav");
        if (x.className === "navbar-nav topnav") {
            x.className += " responsive";
        } else {
            x.className = "navbar-nav";
            x.className += " topnav";
        }
    }
}


