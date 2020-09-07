import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, ValidatorFn} from "@angular/forms";
import {ShoppinglistFactory} from "../shared/shopping-factory";
import {ShoppingList, Comment} from "../shared/shopping-list";
import {Article} from "../shared/article";
import {ShoppinglistService} from "../shared/shoppinglist.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingFormErrorMessages} from "./shoppinglist-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
    selector: 'bs-shoppinglist-form',
    templateUrl: './shoppinglist-form.component.html',
    styles: []
})
export class ShoppinglistFormComponent implements OnInit {
    shoppinglistForm: FormGroup;
    shoppingList= ShoppinglistFactory.empty();
    errors: { [key: string]: string } = {};

    isUpdatingShoppinglist = false;
    articles: FormArray;
    constructor(private fb: FormBuilder, private sl: ShoppinglistService,
                private route: ActivatedRoute, private router: Router,
                private authService: AuthenticationService) {
    }

    /**
     * checken ob user in update or creation modus, initialization of the shoppinglist
     */
    ngOnInit(): void {
        //get the id of route, check if update modus or creation modus
        const idOfList = this.route.snapshot.params['id'];
       // this.sl.getAllUnits().subscribe(res => this.aUnits = res);
        if (idOfList) {
            this.isUpdatingShoppinglist = true;
            this.sl.getSingle(idOfList).subscribe(shoppinglist => {
                this.shoppingList = shoppinglist;
                //need initialization of shoppinglist due to callback
                this.initShoppinglist();
            });
        }
        this.initShoppinglist();
    }

    /**
     * initialization of shoppinglist
     */
    initShoppinglist() {
        this.buildShoppingitemsArray();
        this.buildMessagesArray();
        //build of the modell und form
        //mapping the formbuilder with the formControlname (shoppinglistForm) of the template
        this.shoppinglistForm = this.fb.group({
            id: this.shoppingList.id,
            title: [this.shoppingList.title, Validators.required],
            until: [this.shoppingList.until, Validators.required],
            articles: this.articles,
            text: this.shoppingList.comments[0].text,
        });
        this.shoppinglistForm.statusChanges.subscribe(()=> this.updateErrorMessages());
    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
    /**
     * builds a new array for the shoppingitems
     */
    buildShoppingitemsArray(){
        //if new shoppinglist had no shoppingitems in creation mode
        if(this.shoppingList.articles.length == 0){
            this.shoppingList.articles.push(new Article(0,"",null,0));
        }
        this.articles = this.fb.array(
            this.shoppingList.articles.map(
                t => this.fb.group({
                    id: this.fb.control(t.id),
                    title: this.fb.control(t.title, Validators.required),
                    amount: this.fb.control(t.amount, [Validators.required, Validators.pattern("^[0-9]*$")]),
                    max_price: this.fb.control(t.max_price),
                })
            )
        );console.log(this.articles.value.amount);
    }

    /**
     * create an array for the messages to be able to write the messagetext of the form into the list
     */
    buildMessagesArray(){
        this.shoppingList.comments = [];
        this.shoppingList.comments.push(new Comment(0, null, null, '', null));
    }

    /**
     * add a new shoppingitem to the formarray control
     */
    addShoppinglistitemControl(){
        this.articles.push(this.fb.group({title:null,amount:null,max_price:null}));
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
        this.shoppinglistForm.value.articles = this.shoppinglistForm.value.articles.filter(article => article.title);
        const shoppingList:ShoppingList=ShoppinglistFactory.fromObject(this.shoppinglistForm.value);
        shoppingList.articles = this.shoppinglistForm.value.articles;

        //prepare the message info
        this.shoppingList.comments[0].text = this.shoppinglistForm.value.text;
        if(this.shoppingList.comments[0].text !==''){
            shoppingList.comments = this.shoppingList.comments;
            shoppingList.comments[0].user_id=this.authService.getCurrentUserId();
        }


        shoppingList.user_id = this.authService.getCurrentUserId();

        if (this.isUpdatingShoppinglist) {
            //navigate to the update form including all existing attribute/objects of the shoppinglist
            this.sl.update(shoppingList).subscribe(res => {
                this.router.navigate(['../../shopping_lists', shoppingList.id], { relativeTo: this.route });
            });
        } else {
            console.log("shoppinglist erstellen");
            console.log(shoppingList);
            //navigate to an empty form
            this.sl.create(shoppingList).subscribe(res => {
                this.shoppingList = ShoppinglistFactory.empty();
               this.shoppinglistForm.reset(ShoppinglistFactory.empty());
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
                    //unit: this.fb.control(e.target.value),
                })
            )
        );
    }
    /**
     * errormessages are updated for the shoppinglist form
     */
    updateErrorMessages() {
        this.errors = {};
        for (const comment of ShoppingFormErrorMessages) {
            const control = this.shoppinglistForm.get(comment.forControl);
            if (control &&
                control.dirty &&
                control.invalid &&
                control.errors[comment.forValidator] &&
                !this.errors[comment.forControl]) {
                this.errors[comment.forControl] = comment.text;
            }
        }
    }


}
