import {ShoppingList} from "./shopping-list";


export class ShoppinglistFactory {

    /**
     *  delivers an empty shoppinglist
     *  is used while data are loaded
     *  meanwhile shoppinglist ist loaded and this returned empty shoppinglist will be overwritten
     */
    static empty(): ShoppingList{
        return new ShoppingList(0, 0, null,"", new Date(), 0,null, [], [], null);
    }


    /**
     * returns the shoppinglist with existing rawdata
     * @param rawShoppingList
     */
    static fromObject(rawShoppingList: any): ShoppingList{
        return new ShoppingList(
            rawShoppingList.id,
            rawShoppingList.user_id,
            rawShoppingList.user,
            rawShoppingList.title,
            typeof(rawShoppingList.until) === 'string'? new Date(rawShoppingList.until) : rawShoppingList.until,
            rawShoppingList.total_amount,
            rawShoppingList.state,
            rawShoppingList.articles,
            rawShoppingList.comments,
            rawShoppingList.volunteer
        )
    }


}
