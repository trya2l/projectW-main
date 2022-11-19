import { randomUUID } from "crypto";
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
    talon: Carte[] = [];
    pioche: Carte[] = [
        new Carte(Valeur.UN, 0, "🃁", Couleur.CARREAU),
        new Carte(Valeur.DEUX, 0, "🃂", Couleur.CARREAU),
        new Carte(Valeur.TROIS, 0, "🃃", Couleur.CARREAU),
        new Carte(Valeur.QUATRE, 0, "🃄", Couleur.CARREAU),
        new Carte(Valeur.CINQ, 0, "🃅", Couleur.CARREAU),
        new Carte(Valeur.SIX, 0, "🃆", Couleur.CARREAU),
        new Carte(Valeur.SEPT, 0, "🃇", Couleur.CARREAU),
        new Carte(Valeur.HUIT, 0, "🃈", Couleur.CARREAU),
        new Carte(Valeur.NEUF, 0, "🃉", Couleur.CARREAU),
        new Carte(Valeur.DIX, 0, "🃊", Couleur.CARREAU),
        new Carte(Valeur.VALET, 0, "🃋", Couleur.CARREAU),
        new Carte(Valeur.DAME, 0, "🃍", Couleur.CARREAU),
        new Carte(Valeur.ROI, 0, "🃎", Couleur.CARREAU),

        new Carte(Valeur.UN, 0, "🂡", Couleur.PIQUE),
        new Carte(Valeur.DEUX, 0, "🂢", Couleur.PIQUE),
        new Carte(Valeur.TROIS, 0, "🂣", Couleur.PIQUE),
        new Carte(Valeur.QUATRE, 0, "🂤", Couleur.PIQUE),
        new Carte(Valeur.CINQ, 0, "🂥", Couleur.PIQUE),
        new Carte(Valeur.SIX, 0, "🂦", Couleur.PIQUE),
        new Carte(Valeur.SEPT, 0, "🂧", Couleur.PIQUE),
        new Carte(Valeur.HUIT, 0, "🂨", Couleur.PIQUE),
        new Carte(Valeur.NEUF, 0, "🂩", Couleur.PIQUE),
        new Carte(Valeur.DIX, 0, "🂪", Couleur.PIQUE),
        new Carte(Valeur.VALET, 0, "🂫", Couleur.PIQUE),
        new Carte(Valeur.DAME, 0, "🂭", Couleur.PIQUE),
        new Carte(Valeur.ROI, 0, "🂮", Couleur.PIQUE),

        new Carte(Valeur.UN, 0, "🂱", Couleur.COEUR),
        new Carte(Valeur.DEUX, 0, "🂲", Couleur.COEUR),
        new Carte(Valeur.TROIS, 0, "🂳", Couleur.COEUR),
        new Carte(Valeur.QUATRE, 0, "🂴", Couleur.COEUR),
        new Carte(Valeur.CINQ, 0, "🂵", Couleur.COEUR),
        new Carte(Valeur.SIX, 0, "🂶", Couleur.COEUR),
        new Carte(Valeur.SEPT, 0, "🂷", Couleur.COEUR),
        new Carte(Valeur.HUIT, 0, "🂸", Couleur.COEUR),
        new Carte(Valeur.NEUF, 0, "🂹", Couleur.COEUR),
        new Carte(Valeur.DIX, 0, "🂺", Couleur.COEUR),
        new Carte(Valeur.VALET, 0, "🂻", Couleur.COEUR),
        new Carte(Valeur.DAME, 0, "🂽", Couleur.COEUR),
        new Carte(Valeur.ROI, 0, "🂾", Couleur.COEUR),

        new Carte(Valeur.UN, 0, "🃑", Couleur.TREFLE),
        new Carte(Valeur.DEUX, 0, "🃒", Couleur.TREFLE),
        new Carte(Valeur.TROIS, 0, "🃓", Couleur.TREFLE),
        new Carte(Valeur.QUATRE, 0, "🃔", Couleur.TREFLE),
        new Carte(Valeur.CINQ, 0, "🃕", Couleur.TREFLE),
        new Carte(Valeur.SIX, 0, "🃖", Couleur.TREFLE),
        new Carte(Valeur.SEPT, 0, "🃗", Couleur.TREFLE),
        new Carte(Valeur.HUIT, 0, "🃘", Couleur.TREFLE),
        new Carte(Valeur.NEUF, 0, "🃙", Couleur.TREFLE),
        new Carte(Valeur.DIX, 0, "🃚", Couleur.TREFLE),
        new Carte(Valeur.VALET, 0, "🃛", Couleur.TREFLE),
        new Carte(Valeur.DAME, 0, "🃝", Couleur.TREFLE),
        new Carte(Valeur.ROI, 0, "🃞", Couleur.TREFLE),

        new Carte(Valeur.JOKER, -3, "🃏", Couleur.JOKER),
        new Carte(Valeur.JOKER, -3, "🃏", Couleur.JOKER),
    ];
    tour: number[] = [];

    public constructor(joueurs: Joueur[]) {
        this.statut = Statut.EN_COURS;
        this.joueurs = joueurs;
        this.melanger(this.pioche);
        this.distribuer();
        this.talon.unshift(this.pioche.shift()!)
        for (let index = 0; index < this.joueurs.length; index++) {
            this.tour.push(index)
        }
        this.joueurs[0].tour = true;
    }

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
            console.log("score de " + this.joueurs[i].getPseudo() + " : " + this.joueurs[i].getScore());
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
        pioche.push(new Carte(Valeur.JOKER, -3, 'joker', Couleur.CARREAU));
        pioche.push(new Carte(Valeur.JOKER, -3, 'joker', Couleur.PIQUE));
        return pioche;
    }

    public melanger(cartes: Carte[]): void {
        //console.log(this.pioche)
        let currentIndex = cartes.length, randomIndex;

        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [cartes[currentIndex], cartes[randomIndex]] = [cartes[randomIndex], cartes[currentIndex]];
        }
        //console.log(this.pioche);
    }

    public distribuer(): void {
        for (let index = 0; index < 4; index++) {
            this.joueurs.forEach((joueur: Joueur) => {
                joueur.piocher(this.pioche.shift()!)
            });
        }
        /*this.talon.push(this.pioche[0]);
        this.pioche.shift();*/
    }

    public fairePiocher(joueur: Joueur): void {
        if (this.isTour(joueur.id)) {
            joueur.piocher(this.piocher()!);
        }
    }

    public piocher(): Carte {
        const carte = this.pioche.shift()!

        if (carte) {
            return carte;
        } else {
            this.melanger(this.talon)
            this.talon.forEach(() => {
                this.pioche.push(this.talon.shift()!)
            })
            this.talon.unshift(this.pioche.shift()!)
            return this.pioche.shift()!;
        }
    }

    public jouerCarte(joueur: Joueur, indice: number) {
        //this.activerEffet(joueur.getCartes()[indice]);
        if (this.isTour(joueur.id)) {
            if (this.talon[0].couleur == joueur.cartes[indice].couleur
                || this.talon[0].valeur == joueur.cartes[indice].valeur
                || joueur.cartes[indice].valeur == Valeur.JOKER
                || this.talon[0].valeur == Valeur.JOKER) {
                joueur.jouerCarte(indice).forEach(carte => {
                    this.talon.unshift(carte)
                })
                if (!joueur.cartes.length) {
                    this.statut = Statut.TERMINEE;
                }
                joueur.tour = false
                this.tour.push(this.tour.shift()!);
                this.joueurs[this.tour[0]].tour = true;
            } else {
                this.fairePiocher(joueur)
            }
        }
    }

    public isTour(id: string): boolean {
        return this.joueurs[this.tour[0]].id == id;
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

    public addJoueur(joueur: Joueur): void {
        this.joueurs.push(joueur);
    }

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