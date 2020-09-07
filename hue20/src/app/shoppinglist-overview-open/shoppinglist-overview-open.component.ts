import { Component, OnInit, Input,Output } from '@angular/core';
import {ShoppingList} from "../shared/shopping-list";
import {ShoppinglistService} from "../shared/shoppinglist.service";
import {AuthenticationService} from "../shared/authentication.service";


@Component({
    selector: 'bs-shoppinglist-overview-open',
    templateUrl: './shoppinglist-overview-open.component.html',
    styles: []
})
export class ShoppinglistOverviewOpenComponent implements OnInit {

    shoppinglists: ShoppingList[];
    constructor(private bs: ShoppinglistService, public authService: AuthenticationService) {
    }

    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
    /*
    does the initialization once the component has been loaded
     */
    ngOnInit() {
        this.bs.getAll().subscribe(res => this.shoppinglists = res);
        console.log("this.shoppinglists");
        console.log(this.shoppinglists);
    }

}

