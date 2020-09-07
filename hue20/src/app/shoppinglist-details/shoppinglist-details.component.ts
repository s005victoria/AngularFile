import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {ShoppingList, Comment} from "../shared/shopping-list";
import {ShoppinglistService} from "../shared/shoppinglist.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppinglistFactory} from "../shared/shopping-factory";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ShoppingFormErrorMessages} from "../shoppinglist-form/shoppinglist-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
    selector: 'bs-shoppinglist-details',
    templateUrl: './shoppinglist-details.component.html',
    styles: []
})
export class ShoppinglistDetailsComponent implements OnInit {
    ShoppingList: ShoppingList = ShoppinglistFactory.empty();
    shoppinglistForm: FormGroup;
    shoppinglistFormAmount: FormGroup;
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
        console.log(params);
        //parse to number to check for id in service function
        this.sl.getSingle(params['id'])
            .subscribe(s => {
                this.ShoppingList = s;
                console.log(this.ShoppingList);
                this.initShoppinglist();
            });
        this.initShoppinglist();
        console.log(this.ShoppingList);

    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }

    /**
     * builds a new array for the shoppingitems
     */
    initShoppinglist() {
        //build of the modell und form
        //mapping the formbuilder with the formControlname (shoppinglistForm) of the template
        this.shoppinglistForm = this.fb.group({
            id: this.ShoppingList.id,
            textComment: ['',Validators.required],

        });
        this.shoppinglistFormAmount = this.fb.group({
            id: this.ShoppingList.id,
            total_amount: [this.ShoppingList.total_amount,Validators.required],
        });
        this.shoppinglistForm.statusChanges.subscribe(()=> this.updateErrorMessages());
    }

    /**
     * save changes to database through submit
     */
    submitForm() {
        // filter empty values
        const shoppinglist:ShoppingList=ShoppinglistFactory.fromObject(this.shoppinglistForm.value);

        //eintrag hinzufügen
        //TODO userid for auth.
        console.log("das ist der text: ");
        console.log(this.shoppinglistForm.value.textComment);
        this.ShoppingList.comments.push(new Comment(this.ShoppingList.comments.length+1, this.authService.getCurrentUserId(),null, this.shoppinglistForm.value.textComment, null));
        shoppinglist.comments = this.ShoppingList.comments;

        //navigate to the update form including all existing attribute/objects of the shoppinglist
        this.sl.update(shoppinglist).subscribe(res => {
            //initialize again once the update ist done to get the updated message data
            this.ngOnInit();
        });
    }

    /**
     * submit to save total amount on inprogress or done lists
     */
    submitFormAmount() {
        // filter empty values
        const shoppinglist:ShoppingList=ShoppinglistFactory.fromObject(this.shoppinglistFormAmount.value);

        this.ShoppingList.total_amount = this.shoppinglistFormAmount.value.total_amount;
        shoppinglist.total_amount = this.ShoppingList.total_amount;
        //navigate to the update form including all existing attribute/objects of the shoppinglist
        this.sl.update(shoppinglist).subscribe(res => {
            //initialize again once the update ist done to get the updated message data
            this.ngOnInit();
        });
    }

    /**
     * remove shoppinglist by clickevent
     */
    removeShoppinglist() {
        if (confirm('Möchtest du die Einkaufsliste wirklich löschen?')) {
            //usage of save-navigation operator to avoid any issues while deleting the list
            this.sl.remove(this.ShoppingList.id)
                .subscribe(res => this.router.navigate(['../'], {relativeTo: this.route}));
        }
    }

    /**
     * errormessages are updated for the shoppinglist form
     */
    updateErrorMessages() {
        this.errors = {};
        for (const message of ShoppingFormErrorMessages) {
            const control = this.shoppinglistForm.get(message.forControl);
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
