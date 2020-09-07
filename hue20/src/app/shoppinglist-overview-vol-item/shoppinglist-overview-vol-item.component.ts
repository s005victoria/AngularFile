import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ShoppingList, State, User} from "../shared/shopping-list";
import {ShoppinglistService} from "../shared/shoppinglist.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../shared/authentication.service";


@Component({
  selector: 'div.bs-shoppinglist-overview-vol-item',
  templateUrl: './shoppinglist-overview-vol-item.component.html',
  styles: []
})
export class ShoppinglistOverviewVolItemComponent implements OnInit {

    @Input() shoppingList: ShoppingList;

    constructor(private sl: ShoppinglistService, private router: Router, private route: ActivatedRoute,private authService: AuthenticationService) { }

    ngOnInit(){}

    /**
     * set list in progress by volunteer
     * @param shoppinglist
     */
    setListInProgress(shoppingList: ShoppingList){
        shoppingList.state = new State(2,'inprogress');
        shoppingList.volunteer= new User(this.authService.getCurrentUserId(),'','','','','',true);
        //navigate to the update form including all existing attribute/objects of the shoppinglist
        this.sl.update(shoppingList).subscribe(res => {

        });
    }

    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
    /**
     * set list to finished
     * @param shoppinglist
     */
    setListToDone(shoppingList: ShoppingList){
        shoppingList.state = new State(3,'done');
        //navigate to the update form including all existing attribute/objects of the shoppinglist
        this.sl.update(shoppingList).subscribe(res => {

        });
    }
}