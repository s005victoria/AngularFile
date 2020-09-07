
export class ErrorMessage {

    constructor(
        public forControl: string,
        public forValidator: string,
        public text: string
    ) { }

}

/*
forControl: welches Feld wir überprüft
forValidator: Fehlerüberprüfungen
text:  die Fehlermessage
 */
export const ShoppingFormErrorMessages = [
    new ErrorMessage('title', 'required', 'Bitte gib einen Titel ein.'),
    new ErrorMessage('titleArticle', 'required', 'Bitte gib einen Produktnamen ein.'),
    new ErrorMessage( 'until' , 'required' , 'Bitte gib an, bis wann deine Einkäufe von einem Freiwilligen übernommen werden sollen'),
    new ErrorMessage( 'amount' , 'required' , 'Bitte gib die Anzahl der Artikel an die du benötigst!'),
    new ErrorMessage( 'amount' , 'pattern("^[0-9]*$")' , 'Bitte gib eine Mengenanzahl.'),
];
