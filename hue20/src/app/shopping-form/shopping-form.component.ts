//version 1 der liste
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, ValidatorFn} from "@angular/forms";
import {ShoppinglistService} from "../shared/shoppinglist.service";
import {AuthenticationService} from "../shared/authentication.service";
import {Article} from "../shared/article";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'bs-shopping',
    templateUrl: './shopping-form.component.html',
    styles: []
})
export class ShoppingComponent implements OnInit {
    shopping: FormGroup;
    shoppingList = ShoppingFactory.empty();
    errors: { [key: string]: string } = {};

    isUpdatingShoppingList = false;
    articles: FormArray;
    constructor(private fb: FormBuilder, private sl: ShoppinglistService,
                private route: ActivatedRoute, private router: Router,
                private authService: AuthenticationService) {
    }
    ngOnInit(): void {
        const idOfList = this.route.snapshot.params['id'];
        if (idOfList) {
            this.isUpdatingShoppingList = true;
            this.sl.getSingle(idOfList).subscribe(shoppingList => {
                this.shoppingList = shoppingList;
                this.initShoppingList();
            });
        }
        this.initShoppingList();
    }

    /**
     * initialization of the shoppinglist
     */
    initShoppingList() {
        this.buildMessagesArray();
        this.buildShoppingitemsArray();
        this.shopping = this.fb.group({
            id: this.shoppingList.id,
            title: [this.shoppingList.title, Validators.required],
            until: [this.shoppingList.until, Validators.required],
            articles: this.articles,
            text: this.shoppingList.comments[0].text,
        });
        this.shopping.statusChanges.subscribe(()=> this.updateErrorMessages());
    }

    /**
     * builds a new array for the shoppingitems
     */
    buildShoppingitemsArray(){
        if(this.shoppingList.articles.length == 0){
            this.shoppingList.articles.push(new Article(0, '',0,null));
        }
        this.articles = this.fb.array(
            this.shoppingList.articles.map(
                t => this.fb.group({
                    id: this.fb.control(t.id),
                    //quantity: this.fb.control(t.quantity),
                    amount: this.fb.control(t.amount, [Validators.required, Validators.pattern("^[0-9]*$")]),
                    title: this.fb.control(t.title, Validators.required),
                    max_price: this.fb.control(t.max_price),
                })
            )
        );
    }

    /**
     * create an array for the messages to be able to write the messagetext of the form into the list
     */
    buildMessagesArray(){
        this.shoppingList.comments = [];

    }

    /**
     * add a new shoppingitem to the formarray control
     */
    addShoppinglistitemControl(){
        this.articles.push(this.fb.group({amount:null,title:null,max_price:null}));
    }

    /**
     * remove a added shoppingitem from the formarray control
     */
    removeShoppinglistitemControl(index: number){
        this.articles.removeAt(index);
    }

    /**
     * save changes to database through submit
     */
    submitForm() {
        // filter empty values
        this.shopping.value.articles = this.shopping.value.articles.filter(article => article.title);
        const shoppingList:ShoppingList=ShoppingFactory.fromObject(this.shopping.value);
        shoppingList.articles = this.shopping.value.articles;
        shoppingList.user_id = this.authService.getCurrentUserId();

        if (this.isUpdatingShoppingList) {
            //navigate to the update form including all existing attribute/objects of the shoppinglist
            this.sl.update(shoppingList).subscribe(res => {
                this.router.navigate(['../../shopping_lists', shoppingList.id], { relativeTo: this.route });
            });
        } else {
            console.log("die shoppinglist zum erstellen");
            console.log(shoppingList);
            //navigate to an empty form
            this.sl.create(shoppingList).subscribe(res => {
                this.shoppingList = ShoppingFactory.empty();
                this.shopping.reset(ShoppingFactory.empty());
                this.router.navigate(['../shopping_lists'], { relativeTo: this.route });
            });
        }
    }

    /**
     * change event on form select option - get new value for unit
     * @param e
     */
    changeUnitOfItem(e) {
        this.articles = this.fb.array(
            this.shoppingList.articles.map(
                t => this.fb.group({
                })
            )
        );
    }

}
