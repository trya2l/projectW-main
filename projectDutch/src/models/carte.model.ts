export class Carte {

    valeur: Valeur;
    point: number;
    url: string;
    couleur: Couleur;

    constructor(valeur: Valeur, point: number, url: string, couleur: Couleur) {
        this.valeur = valeur;
        this.point = point;
        this.url = url;
        this.couleur = couleur;
    }

    public getValeur() {
        return this.valeur;
    }

    public getPoint() {
        return this.point;
    }

    public getUrl() {
        return this.url;
    }

    public getCouleur() {
        return this.couleur;
    }

    public isRed() {
        return this.couleur == Couleur.CARREAU || this.couleur == Couleur.COEUR;
    }

}
export enum Valeur {
    UN = "UN",
    DEUX = "DEUX",
    TROIS = "TROIS",
    QUATRE = "QUATRE",
    CINQ = "CINQ",
    SIX = "SIX",
    SEPT = "SEPT",
    HUIT = "HUIT",
    NEUF = "NEUF",
    DIX = "DIX",
    VALET = "VALET",
    DAME = "DAME",
    ROI = "ROI",
    JOKER = "JOKER"
}

export enum Couleur {
    COEUR = "COEUR",
    CARREAU = "CARREAU",
    PIQUE = "PIQUE",
    TREFLE = "TREFLE",
    JOKER = "JOKER"
}