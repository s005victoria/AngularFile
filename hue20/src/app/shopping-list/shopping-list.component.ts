import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Comment, ShoppingList} from "../shared/shopping-list";
import {ShoppinglistService} from "../shared/shoppinglist.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppinglistFactory} from "../shared/shopping-factory";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ShoppingFormErrorMessages} from "../shopping-form/book-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";


@Component({
    selector: 'bs-shopping-list',
    templateUrl: './shopping-list.component.html',
    styles: []
})
export class ShoppingListComponent implements OnInit {
    shoppingList: ShoppingList = ShoppinglistFactory.empty();
    shoppingListForm: FormGroup;
    shoppingListFormAmount: FormGroup;
    errors: { [key: string]: string } = {};
    constructor(
        private fb: FormBuilder,
        private sl: ShoppinglistService,
        private router: Router,
        private route: ActivatedRoute,
        public authService: AuthenticationService
    ) {
    }

    ngOnInit() {
        const params = this.route.snapshot.params;
        //parse to number to check for id in service function
        this.sl.getSingle(params['id'])
            .subscribe(s => {
                this.shoppingList = s;
                this.initShoppingList();
            });
        this.initShoppingList();
    }

    /**
     * builds a new array for the shoppingitems
     */
    initShoppingList() {
        //build of the modell und form
        //mapping the formbuilder with the formControlname (shoppinglistForm) of the template
        this.shoppingListForm = this.fb.group({
            id: this.shoppingList.id,
            text: ['',Validators.required],
            //bills: this.bills
        });
        this.shoppingListFormAmount = this.fb.group({
            id: this.shoppingList.id,
           // total_amount: [this.shoppingList.total_amount,Validators.required],
        });
        this.shoppingListForm.statusChanges.subscribe(()=> this.updateErrorMessages());
    }

    /**
     * save changes to database through submit
     */
    submitForm() {
        // filter empty values
        const shoppingList:ShoppingList=ShoppinglistFactory.fromObject(this.shoppingListForm.value);

        //eintrag hinzufügen
        //TODO userid for auth.
        this.shoppingList.comments.push(new Comment( this.authService.getCurrentUserId(),null, this.shoppingListForm.value.text, null, null));
        shoppingList.comments = this.shoppingList.comments;

        //navigate to the update form including all existing attribute/objects of the shoppinglist
        this.sl.update(shoppingList).subscribe(res => {
            //initialize again once the update ist done to get the updated message data
            this.ngOnInit();
        });
    }

    /**
     * submit to save total amount on inprogress or done lists
     */
    submitFormAmount() {
        // filter empty values
        const shoppingList:ShoppingList=ShoppinglistFactory.fromObject(this.shoppingListFormAmount.value);

        this.shoppingList.total_amount = this.shoppingListFormAmount.value.total_amount;
        shoppingList.total_amount = this.shoppingList.total_amount;
        //navigate to the update form including all existing attribute/objects of the shoppinglist
        this.sl.update(shoppingList).subscribe(res => {
            //initialize again once the update ist done to get the updated message data
            this.ngOnInit();
        });
    }

    /**
     * remove shoppinglist by clickevent
     */
    removeShoppingList() {
        if (confirm('Möchtest du die Einkaufsliste wirklich löschen?')) {
            //usage of save-navigation operator to avoid any issues while deleting the list
            this.sl.remove(this.shoppingList.id)
                .subscribe(res => this.router.navigate(['../'], {relativeTo: this.route}));
        }
    }

    /**
     * errormessages are updated for the shoppinglist form
     */
    updateErrorMessages() {
        this.errors = {};
        for (const message of ShoppingFormErrorMessages) {
            const control = this.shoppingListForm.get(message.forControl);
            if (control &&
                control.dirty &&
                control.invalid &&
                control.errors[message.forValidator] &&
                !this.errors[message.forControl]) {
                this.errors[message.forControl] = message.text;
            }
        }
    }
}

