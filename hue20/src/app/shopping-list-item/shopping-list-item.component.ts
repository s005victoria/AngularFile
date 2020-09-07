
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ShoppingList} from "../shared/shopping-list";

@Component({
    selector: 'bs-shopping-list-item',
    templateUrl: './shopping-list-item.component.html',
    styles: []
})

export class ShoppingListItemComponent implements OnInit {
    @Input() ShoppingList: ShoppingList;
    //used for event on detail view
    //@Output() showDetailsEvent = new EventEmitter<Shoppinglist>();

    constructor() { }

    ngOnInit(){}

    /*
    show List-Details page by Event
    */
    /*
    showShoppinglistDetails (shoppinglist: Shoppinglist){
      this.showDetailsEvent.emit(shoppinglist);
    }
    */

}
