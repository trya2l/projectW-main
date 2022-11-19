import type { Request, Response } from "express";
import { Joueur } from "../models/joueur.model";
import { Partie, Statut } from "../models/partie.model";
import { Room } from "../models/room";
import { createRoom, getRoom, getRooms, getRoomById } from "./roomController";

//api function get partie from the room
function getPartie(req: Request, res: Response) {
  //get the room id
  const roomId = req.body.roomId;
  //get the room
  const room = getRoomById(roomId);
  //get the partie
  //check if the room exist
  if (room) {
    //get the partie
    const partie = room.getPartie();
    //send the partie to the client
    res.send(partie);
    return partie;
  } else {
    res.send("room not found");
  }
}

// api demande de demarrage de la partie
function startPartie(req: Request, res: Response) {
  const room = getRoomById(req.body.roomId);
  const partie = room?.getPartie();


  //check if the partie exist

  if (partie?.getStatut() != Statut.EN_COURS) {
    //start the partie
    //get all user in the room of the partie
    const usersInRoom = room?.getUsers();

    if (usersInRoom) {
      partie?.start(usersInRoom);
    }
    //send the partie to the client
    res.send(partie);
  } else {
    res.send("partie not found");
  }
}

// api demande de fin de la partie
function endPartie(req: Request, res: Response) {
  const partie = getPartie(req, res);
  //check if the partie exist
  if (partie) {
    //end the partie
    partie.end();
    //send the partie to the client
    res.send(partie);
  } else {
    res.send("partie not found");
  }
}

export { getPartie };
