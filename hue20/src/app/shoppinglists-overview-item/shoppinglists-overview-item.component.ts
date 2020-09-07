import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ShoppingList} from "../shared/shopping-list";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'a.bs-shoppinglists-overview-item',
  templateUrl: './shoppinglists-overview-item.component.html',
  styles: []
})

export class ShoppinglistsOverviewItemComponent implements OnInit {
  @Input() shoppingList: ShoppingList;
  //used for event on detail view
  //@Output() showDetailsEvent = new EventEmitter<Shoppinglist>();


  constructor(private authService: AuthenticationService) {


  }

  ngOnInit(){}

  /*
  show List-Details page by Event
  */
  /*
  showShoppinglistDetails (shoppinglist: Shoppinglist){
    this.showDetailsEvent.emit(shoppinglist);
  }
  */
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }

}
