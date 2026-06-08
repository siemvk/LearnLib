# gradeMakers

Een GradeMaker is een manier om te bepalen hoe goed een kaart beantwoord is. Je checkt niet het antwoord maar kijkt naar tijd en andere factoren om te bepalen hoe goed een kaart beantwoord is.

`gradeMaker`
`naam` De naam van de gradeMaker, bijv "Simple" deze gaat naar de users
`description` Een korte beschrijving van de gradeMaker, deze gaat ook naar de users
`id` Interne ID van de gradeMaker, deze gaat niet naar de users en kan dus een random string zijn. deze moet gemaakt worden met een `urlSafeString` functie, omdat deze gebruikt wordt in de config en dus geen rare tekens mag bevatten
`gradeKaart` Deze functie neemt een kaart en de tijd die erover gedaan is om hem te beantwoorden en geeft een grade enum terug. Deze word gebruikt door bijv fsrs om te bepalen hoe goed een kaart beantwoord is en dus hoe snel hij weer herhaald moet worden. Hier komt je code.