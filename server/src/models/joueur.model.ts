import { Carte } from "./carte.model";

export class Joueur {
    id: string;
    pseudo: string;
    roomId: string;
    victoires: number;
    tour: boolean;
    cartes: Carte[];

    public constructor(id: string, pseudo: string, roomId: string, victoires: number, cartes: Carte[]) {
        this.id = id;
        this.pseudo = pseudo;
        this.roomId = roomId;
        this.victoires = victoires;
        this.cartes = cartes;
        this.tour = false;
    }

    public getCartes(): Carte[] {
        return this.cartes;
    }

    public getId(): any {
        return this.id;
    }

    public setId(id: any) {
        this.id = id;
    }

    public getPseudo(): string {
        return this.pseudo;
    }

    public getRoomId(): any {
        return this.roomId;
    }

    public setPseudo(pseudo: string) {
        this.pseudo = pseudo;
    }

    public jouerCarte(indice: number): Carte[] {
        return this.cartes.splice(indice, 1);
    }

    public piocher(carte: Carte): void {
        this.cartes.unshift(carte);
    }

    public getScore(): number {
        let score = 0;
        for (let i = 0; i < this.cartes.length; i++) {
            score += this.cartes[i].getPoint();
        }
        return score;
    }
}