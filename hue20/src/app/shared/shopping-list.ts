//Damit später nicht immer alle vier Klassen von vier verschiedenen Files importiert
//werden müssen, importieren wir hier nicht nur sondern re-exportieren diese auch
import {Article} from "./article";
export {Article} from "./article";
import {State} from "./state";
export {State} from "./state";
import {Comment} from "./comment";
export {Comment} from "./comment";
import {User} from "./user";
export {User} from "./user";

export class ShoppingList {
    constructor(
        public id: number,
        public user_id: number,
        public user: User,
        public title: string,
        public until: Date,
        public total_amount: number,
        public state: State,
        public articles: Article[],
        public comments?: Comment[],
        public volunteer?: User
    ){}
}
