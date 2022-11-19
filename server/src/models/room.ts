import { Joueur } from './joueur.model';
import { Partie } from './partie.model';

export enum Statut {
  EN_ATTENTE = "EN_ATTENTE",
  EN_COURS = "EN_COURS",
}

//create room class
export class Room {
  statut;
  id: string;
  name: string;
  users: Joueur[];
  partie: Partie;

  constructor(id: any, joueurs: Joueur[], name: any) {
    this.partie = new Partie(joueurs);
    this.id = id;
    this.name = name;
    this.users = [];
    this.statut = Statut.EN_ATTENTE;
  }
  //get the room id
  getId() {
    return this.id;
  }
  //get the room name
  getName() {
    return this.name;
  }

  //get the room statut
  getStatutRoom() {
    return this.statut;
  }

  getStatut() {
    return this.statut;
  }

  setStatut(statut: Statut) {
    this.statut = statut;
  }

  //set the room id
  setId(id: any) {
    this.id = id;
  }
  //set the room name
  setName(name: any) {
    this.name = name;
  }
  //get the users in the room
  getUsers() {
    return this.users;
  }
  //add a user to the room
  addUser(user: any) {
    this.users.push(user);
  }
  //remove a user from the room
  removeUser(user: any) {
    this.users = this.users.filter((u: any) => u.id !== user.id);
  }

  //get the partie in the room
  getPartie() {
    return this.partie;
  }



}
