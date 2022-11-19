export class User {
    id: string;
    pseudo: string;
    roomId: string;
    victoires: number;

    public constructor(id: string, pseudo: string, roomId: string) {
        this.id = id;
        this.pseudo = pseudo;
        this.roomId = roomId;
        this.victoires = 0;
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string) {
        this.id = id;
    }

    public getPseudo(): string {
        return this.pseudo;
    }

    public getRoomId(): string {
        return this.roomId;
    }

    public setRoomId(roomId: string) {
        this.roomId = roomId;
    }

    public setPseudo(pseudo: string) {
        this.pseudo = pseudo;
    }

    public getVictoires(): number {
        return this.victoires;
    }

    public setVictoires(victoires: number) {
        this.victoires = victoires;
    }
}