import { Carte, Valeur, Couleur } from "./carte.model";
import { Joueur } from "./joueur.model";

export enum Statut {
    EN_COURS,
    PAUSE,
    TERMINEE
}

export class Partie {
    statut: Statut;
    joueurs: Joueur[];
    pioche: Carte[];
    talon: Carte[] = [];

    public constructor() {
        this.statut = Statut.TERMINEE;
        this.joueurs = [
            new Joueur(0, "Allan", 1, 0),
            new Joueur(1, "Valentin", 1, 0),
            new Joueur(2, "Mathieu", 1, 0),
            new Joueur(3, "Benoît", 1, 0),
            new Joueur(4, "Kylian", 1, 0),
        ];
        this.pioche = this.initPioche();
        this.melanger();
        this.distribuer();
    }

    /*public constructor(joueurs: Joueur[]) {
        this.statut = Statut.EN_COURS;
        this.joueurs = joueurs;
        this.pioche = this.initPioche();
        this.melanger();
        this.distribuer();
    } */

    public start(joueurs: Joueur[]): void {
        this.statut = Statut.EN_COURS;
        this.joueurs = joueurs;
    }
    public pause(): void { // Facultatif
        this.statut = Statut.PAUSE;
    }
    public end(): void {
        this.statut = Statut.TERMINEE;
        let gagnant = this.joueurs[0];
        for (let i = 0; i < this.joueurs.length; i++) {
            if (this.joueurs[i].getScore() > gagnant.getScore()) {
                gagnant = this.joueurs[i];
            }
            console.log("score de " + this.joueurs[i].getPseudo() + " : " + this.joueurs[i].getScore);
        }
    }

    public initPioche(): Carte[] {
        var pioche: Carte[] = [];
        let coul = [Couleur.COEUR, Couleur.CARREAU, Couleur.PIQUE, Couleur.TREFLE];
        let val = [Valeur.UN, Valeur.DEUX, Valeur.TROIS, Valeur.QUATRE, Valeur.CINQ, Valeur.SIX, Valeur.SEPT, Valeur.HUIT, Valeur.NEUF, Valeur.DIX, Valeur.VALET, Valeur.DAME, Valeur.ROI];

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 13; j++) {
                if (j != 12)
                    pioche.push(new Carte(val[j], j + 1, '🂠', coul[i]));
                else {
                    if (i < 2)
                        pioche.push(new Carte(val[j], 0, '🃂', coul[i]));
                    else
                        pioche.push(new Carte(val[j], 20, '🃕', coul[i]));
                }
            }
        }
        pioche.push(new Carte(Valeur.JOKER, -3, '', Couleur.CARREAU));
        pioche.push(new Carte(Valeur.JOKER, -3, '', Couleur.PIQUE));
        return pioche;
    }

    public melanger(): void {
        console.log(this.pioche)
        let currentIndex = this.pioche.length, randomIndex;

        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.pioche[currentIndex], this.pioche[randomIndex]] = [this.pioche[randomIndex], this.pioche[currentIndex]];
        }
        console.log(this.pioche);
    }

    public distribuer(): void {
        while (this.joueurs[0].getCartes().length != 4) {
            this.joueurs.forEach(joueur => {
                joueur.piocher(this.pioche.shift()!)
            });
        }
        /*this.talon.push(this.pioche[0]);
        this.pioche.shift();*/
    }

    public fairePiocher(joueur: Joueur): void {
        joueur.piocher(this.pioche[0]);
        this.pioche.shift();
    }

    public jouerCarte(joueur: Joueur, indice: number) {
        this.activerEffet(joueur.getCartes()[indice]);
        joueur.jouerCarte(indice);

    }

    public echanger(j1: Joueur, indice1: number, j2: Joueur, indice2: number): void {
        let carteTemp = j1.getCartes()[indice1];
        j1.getCartes()[indice1] = j2.getCartes()[indice2];
        j2.getCartes()[indice2] = carteTemp;
    }

    public activerEffet(carte: Carte): void {
        switch (carte.getValeur()) {
            case Valeur.UN:
                // this.fairePiocher(joueur[i]);
                console.log("pioche joueur");
            case Valeur.VALET:
                // this.echanger();
                console.log("échanger 2 cartes joueur");
            case Valeur.DAME:
                //joueur[i].voir();
                console.log("voir carte joueur");
        }
    }

    //add joueur
    public addJoueur(joueur: Joueur): void {
        this.joueurs.push(joueur);
    }

    //remove joueur
    public removeJoueur(joueur: Joueur): void {
        this.joueurs.splice(this.joueurs.indexOf(joueur), 1);
    }

    //getters
    public getStatut(): Statut {
        return this.statut;
    }

    public getJoueurs(): Joueur[] {
        return this.joueurs;
    }

    public getPioche(): Carte[] {
        return this.pioche;
    }

    public getTalon(): Carte[] {
        return this.talon;
    }

    //setters

    public setStatut(statut: Statut): void {
        this.statut = statut;
    }

    public setJoueurs(joueurs: Joueur[]): void {
        this.joueurs = joueurs;
    }

    public setPioche(pioche: Carte[]): void {
        this.pioche = pioche;
    }

    public setTalon(talon: Carte[]): void {
        this.talon = talon;
    }


}



/*
const j1 = new Joueur('Antonin', 0);
const j2 = new Joueur('Michel', 0);
const j3 = new Joueur('Félix', 0);

const joueurs= [j1,j2,j3];
let partie = new Partie(joueurs);

console.log(j1.cartes);
console.log(j2.cartes);
console.log(j3.cartes);

for(let i=0;i<2;i++){
    for(let j=0;j<joueurs.length; j++){
        joueurs[j].jouerCarte(Math.floor(Math.random() * joueurs[j].cartes.length));
    }
}

console.log(j1.cartes);
console.log(j2.cartes);
console.log(j3.cartes); 
*/