export class User {
    constructor(
        public id: number,
        public firstname: string,
        public lastname: string,
        public address: string,
        public email: string,
        public password: string,
        public volunteer?: boolean
    ){}
}

