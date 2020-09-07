import {User} from "./user";
export {User} from "./user";

export class Comment {
    constructor(public id:number,
                public user_id: number,
                public user:User,
                public text:string,
                public created_at: Date
    ){}

}
