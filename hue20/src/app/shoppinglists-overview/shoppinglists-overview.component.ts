
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ShoppingList, Article, State, User, Comment} from "../shared/shopping-list";
import {ShoppinglistService} from "../shared/shoppinglist.service";
import {AuthenticationService} from "../shared/authentication.service";



@Component({
    selector: 'bs-shoppinglists-overview',
    templateUrl: './shoppinglists-overview.component.html',
    styles: []
})
export class ShoppinglistsOverviewComponent implements OnInit {

    shoppinglists: ShoppingList[];
    hasListOpenItems: false;
    hasListInProgressItems: false;
    hasListDoneItems: false;

    constructor(private bs: ShoppinglistService, public authService: AuthenticationService) {
    }


    /*
    does the initialization once the component has been loaded
     */
    ngOnInit() {
        this.bs.getAll().subscribe(res => this.shoppinglists = res);
        this.checkStatusItems();
    }


    /**
     * filters the shoppinglists into several lists to easily view it in the template
     * @param statusFilter
     */
    checkStatusItems() {
        this.shoppinglists?.forEach(function (shoppingList) {
            console.log("hallo1");
            if (shoppingList.user.id == this.authService.getCurrentUserId() ||
                this.authService.isCurrentUserVolunteer() && shoppingList ?.volunteer.id == this.authService.getCurrentUserId())
            {
                switch (shoppingList.state.id) {
                    case 1:
                        this.hasListOpenItems = true;
                        break;
                    case 2:
                        this.hasListInProgressItems = true;
                        break;
                    case 3:
                        this.hasListDoneItems = true;
                        break;
                    default:
                        break;
                }
            }
        })
    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }



}
