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
    new ErrorMessage( 'until' , 'required' , 'Die Deadline muss für den Freiwilligen angegebenen werden.'),
    new ErrorMessage( 'amount' , 'required' , 'Die Anzahl muss für den Einkauf dieses Produktes angegeben werden.'),
    new ErrorMessage( 'amount' , 'pattern("^[0-9]*$")' , 'Bitte gib eine Zahl für die Menge an.'),
];
