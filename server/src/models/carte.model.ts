export class Carte {

    valeur: Valeur;
    point: number;
    visible: boolean;
    image: string;
    url: string;
    couleur: Couleur;

    constructor(valeur: Valeur, point: number, url: string, couleur: Couleur) {
        this.valeur = valeur;
        this.point = point;
        this.visible = false;
        this.image = url;
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

    public tourner() {
        if (this.visible) {
            this.url = "🂠";
            this.visible = !this.visible
        } else {
            this.url = this.image;
            this.visible = !this.visible
        }
        return
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