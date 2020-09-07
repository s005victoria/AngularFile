import { NgModule } from '@angular/core' ;
import {Routes, RouterModule} from '@angular/router' ;
import { HomeComponent } from './home/home.component' ;
import {ShoppinglistsOverviewComponent} from "./shoppinglists-overview/shoppinglists-overview.component";
import {ShoppinglistDetailsComponent} from "./shoppinglist-details/shoppinglist-details.component";
import {ShoppinglistFormComponent} from "./shoppinglist-form/shoppinglist-form.component";
import {LoginComponent} from "./login/login.component";
import {ShoppinglistOverviewOpenComponent} from "./shoppinglist-overview-open/shoppinglist-overview-open.component";
import {ShoppinglistFactory} from "./shared/shopping-factory";
import {ShoppingFormErrorMessages} from "./shoppinglist-form/shoppinglist-form-error-messages";
import {ShoppingList} from "./shared/shopping-list";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";


const routes : Routes = [
    {path: '' , redirectTo: 'home' , pathMatch: 'full'},
    {path: 'home' , component: HomeComponent},
    //das ist die einkaufstliste die sowohl für den freiwilligen als auch für den suchenden angezeigt wird
    //hier werden alle übernommenen Listen für den freiwilligen angezeigt
    {path: 'shopping_lists' , component: ShoppinglistsOverviewComponent},

    //das openshoppinglists ist die ansicht für den volunteer wo alle noch offenen Einkauslisten angezeigt werden
    {path: 'openShoppinglists' , component: ShoppinglistOverviewOpenComponent},
    {path: 'shopping_lists/:id' , component: ShoppinglistDetailsComponent},
    {path: 'createList' , component: ShoppinglistFormComponent},
    {path: 'editList/:id' , component: ShoppinglistFormComponent},
    {path: 'login' , component: LoginComponent},
];

//forRoot.. methode to generate new module with the routing
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})

export class AppRoutingModule { }
