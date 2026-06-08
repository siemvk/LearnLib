# Methodes

Een methode is een manier om te bepalen op welke dag een kaart herhaald moet worden. Deze bepaalt dus niet de wachtrij die daar uit volgt, maar alleen de dag waarop een kaart herhaald moet worden. 

`leerMethode`
`naam` De naam van de methode, bijv "Simple" of "FSRS" deze gaat naar de users
`description` Een korte beschrijving van de methode, deze gaat ook naar de users
`id` Interne ID van de methode, deze gaat niet naar de users en kan dus een random string zijn. deze moet gemaakt worden met een `urlSafeString` functie, omdat 
`reviewKaart` Deze functie neemt een kaart en past hem aan volgens de methode, hier komt je code.
