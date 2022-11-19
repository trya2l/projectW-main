import type { Request, Response } from "express";
import { send } from "process";
import { Joueur } from "../models/joueur.model";
import { Room } from "../models/room";

//listes des rooms
const rooms: Room[] = [];

//get the list of rooms

function getRooms(req: Request, res: Response) {
  //send the list of rooms to the client
  res.send(rooms);
}

// get room by id
function getRoomById(roomId: string) {
  //get the room
  const room = rooms.find((room) => room.getId() == roomId);
  return room;
}

//api function post request to create a new room
function createRoom(req: Request, res: Response) {
  const joueurs: Joueur[] = []
  req.body.joueurs.forEach((user: Joueur) => {
    joueurs.push(new Joueur(user.id, user.pseudo, user.roomId, user.victoires, []))
  });

  const roomId = req.body.roomId;

  const room = rooms.find((room) => room.getId() == roomId);
  if (room) {
    res.send(room);
  } else {
    //create a new room
    const newRoom = new Room(req.body.roomId, joueurs, req.body.roomName);
    //add the room to the list of rooms
    rooms.push(newRoom);
    //send the room to the client
    res.send(newRoom);
  }
}

function cleanRooms(req: Request, res: Response) {
  //delete all rooms
  rooms.length = 0;
  res.send();
}

//api function post request to get a room
function getRoom(req: Request, res: Response) {
  //get the room id
  const roomId = req.body.roomId;
  //get the room
  const room = rooms.find((room) => room.getId() == roomId);
  //send the room to the client
  if (room) {
    res.send(room);
  } else {
    res.send("room not found");
    //send the room to the client
  }
}

//api function post request to get a room
function piocher(req: Request, res: Response) {
  //get the room id

  console.log(req.body.userId)
  const roomId = req.body.roomId;
  //get the room
  const room = rooms.find((room) => room.getId() == roomId)!;
  console.log(room.partie.joueurs)
  //send the room to the client
  if (room) {
    const user = room.partie.joueurs.find(joueur => joueur.id == req.body.userId)!;

    room.partie.fairePiocher(user);
    console.log(room.partie.joueurs)

    res.send(room);
  } else {
    res.send("room not found");
    //send the room to the client
  }
}

//api function post request to get a room
function jouerCarte(req: Request, res: Response) {

  //get the room id
  console.log(req.body.userId)
  const roomId = req.body.roomId;
  //get the room
  const room = rooms.find((room) => room.getId() == roomId)!;
  console.log(room.partie.joueurs)
  //send the room to the client
  if (room) {
    const user = room.partie.joueurs.find(joueur => joueur.id == req.body.userId)!;

    room.partie.jouerCarte(user, req.body.indexCarte);

    res.send(room);
  } else {
    res.send("room not found");
    //send the room to the client
  }
}

//export the functions

export { createRoom, getRoom, getRooms, getRoomById, cleanRooms, jouerCarte, piocher };
