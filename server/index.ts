import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { buildRoutes } from "./src/router/router";
import dotenv from "dotenv";
import { connect } from "mongoose";
import { randomUUID } from "crypto";

import { Joueur } from "./src/models/joueur.model";
import { Carte, Valeur, Couleur } from "./src/models/carte.model";
import { Partie } from "./src/models/partie.model";
import { Room } from "./src/models/room";
import { User } from "./src/models/user.model";

dotenv.config();

const app: Express = express();
const cors = require("cors");
const port = process.env.PORT;
const path = process.env.PATH;
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const genuuid = require("uuid");
const session = require("express-session");
const io = require("socket.io")(http, {
  cookie: true,
  cors: {
    origin: "*",
  }
});

//cors
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", buildRoutes());

app.get("/", (req: Request, res: Response) => {
  //res.send("Express + TypeScript Server" + req.sessionID);
  console.log(io.engine.clientsCount);
  //res.sendFile(__dirname + "/index.html");
  res.send();
});

//create list of rooms
let rooms: Room[] = [];
//create list of partie
let parties: Partie[] = [];
//create lists of users
let users: User[] = [];

const uuid = require("uuid");

io.engine.generateId = function (req: any) {
  return uuid.v4();
};

// create cookie session
/*
io.engine.on("initial_headers", (headers: any, req: any) => {

  console.log(req.headers.cookie);
  console.log(users);
  if (req.headers.cookie) {
    console.log("cookie : ", req.headers.cookie);
    //check if user is already in the list
    let user = users.find((user) => user.getId() == req.headers.cookie);
    console.log("user exists : ", user);
  } else {
    //generate a new cookie with uuid
    let cookie = uuid.v4() + "; Max-Age=" + 24 * 60 * 60 * 1000;
    console.log("new cookie : ", cookie);
    headers["set-cookie"] = `session-cookie=${cookie}`;
    //create new users
    const newUser = new Joueur(cookie, "Anonyme", "0", 0);
    users.push(newUser);
    console.log("new user : ", newUser);
  }
  console.log(headers);
});*/

io.on("connection", function (socket: any) {
  //console.log(socket);
  /*console.log(socket.rooms);
  console.log(socket.id);
  socket.join('room1');
  console.log(socket.rooms);*/
  socket.on("new-user", function (username: string) {
    if (username) {
      let id = uuid.v4();
      let cookie = 'session-cookie=' + id + "; Max-Age=" + 24 * 60 * 60 * 1000;
      let user = new User(id, username, id);
      users.push(user);
      console.log("Nouvel utilisateur enregistré. ID: " + user.getId() + " - Pseudo: " + user.getPseudo());
      socket.emit("cookie", cookie);
    } else {
      socket.emit("get-user", null);
    }
  });

  socket.on("find-user", (id: string) => {
    let user = users.find((user) => user.getId() == id)!;
    if (user) {
      //      socket.join(user.getRoomId());
      socket.join(user.getRoomId());
      io.to(socket.id).emit("get-user", user);
      //io.to(socket.id).emit("to-room", user.getRoomId());
      console.log("Nouvelle connection détectée. ID: " + user.getId() + " - Pseudo: " + user.getPseudo());
    } else {
      socket.emit("get-user", null);
    }
  });

  socket.on("room-users", (room: string) => {
    let usersInRoom = users.filter(user => user.getRoomId() == room);
    console.log("users in room " + room + " : " + usersInRoom.length)
    //console.log(usersInRoom)
    socket.join(room);
    io.to(room).emit("to-room", usersInRoom);
  });

  socket.on("new-room", (id: any) => {
    console.log("new-room")
    users.find((user) => user.getId() == id)!.setRoomId(id);
    //console.log(socket.id);
    socket.join(id);
    io.to(id).emit("room-created")
  });

  socket.on("hello-room", (room: any) => {
    console.log("hello-room")
    let usersInRoom = users.filter(user => user.getRoomId() == room);
    io.to(room).emit("to-room", usersInRoom);

  });

  socket.on("alert-update", (room: any) => {
    io.to(room).emit("update");
  });

  socket.on("fin-partie", (room: any, user: any) => {
    io.to(room).emit("fin-partie", user);
  });

  socket.on("join-room", (id: any, room: any) => {
    users.find((user) => user.getId() == id)!.setRoomId(room);
    let usersInRoom = users.filter(user => user.getRoomId() == room);
    console.log("users in room " + room + " : " + usersInRoom.length)
    socket.join(room);
    io.to(room).emit("to-room", usersInRoom);
  });

  socket.on("new-game", function (usersInRoom: any, room: string) {
    console.log("new-game");
    /*
    if (usersInRoom.length) {
      const usrsTemp: Joueur[] = []
      usersInRoom.forEach((user: Joueur) => {
        usrsTemp.push(new Joueur(user.id, user.pseudo, user.roomId, user.victoires))
      });
      usersInRoom = usrsTemp;
      console.log("partie créé")
      parties.push(new Partie(usersInRoom));
      console.log("partie créé")*/
    io.to(room).emit("game-starting");
  });
});

/*
io.of("/").adapter.on("create-room", (room: any) => {
  console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room: any, id: any) => {
  console.log(`socket ${id} has joined room ${room}`);
});
*/

/*
// post request to create a new room
app.post("/createRoom", (req: Request, res: Response) => {
  //create a new room
  const newRoom = new Room(req.body.roomId, req.body.roomName);
  //add the room to the list of rooms
  rooms.push(newRoom);
  //send the room to the client
  res.send(newRoom);
});

// post request to join a room
app.post("/joinRoom", (req: Request, res: Response) => {
  //get the room id
  const roomId = req.body.roomId;
  //get the room
  const room = rooms.find((room) => room.getId() == roomId);
  //send the room to the client
  res.send(room);
});

// post request to create a new user
app.post("/createUser", (req: Request, res: Response) => {
  //create a new user
  const newUser = new Joueur(
    req.body.userId,
    req.body.userName,
    req.body.roomId,
    0
  );
  //add the user to the list of users
  users.push(newUser);
  //send the user to the client
  res.send(newUser);
});

// post request to get a user
app.post("/getUser", (req: Request, res: Response) => {
  //get the user id
  const userId = req.body.userId;
  //get the user
  const user = users.find((user) => user.getId() == userId);
  //send the user to the client
  res.send(user);
});

// post request to get a room
app.post("/getRoom", (req: Request, res: Response) => {
  //get the room id
  const roomId = req.body.roomId;
  //get the room
  const room = rooms.find((room) => room.getId() == roomId);
  //send the room to the client
  res.send(room);
});

// get request to get all rooms
app.get("/getRooms", (req: Request, res: Response) => {
  //send the list of rooms to the client
  res.send(rooms);
});

// get request to get all users
app.get("/getUsers", (req: Request, res: Response) => {
  //send the list of users to the client
  res.send(users);
});

// get request to get all users in a room
app.post("/getUsersInRoom", (req: Request, res: Response) => {
  //get the room id
  const roomId = req.body.roomId;
  //get the list of users in the room
  const usersInRoom = users.filter((user) => user.getRoomId() == roomId);
  //send the list of users to the client
  res.send(usersInRoom);
});

//join room with id in url
app.get("/room/:id", (req: Request, res: Response) => {
  //get the room id
  const roomId = req.params.id;
  //get the room
  const room = rooms.find((room) => room.getId() == roomId);
  //check if the room exists
  if (room) {
    res.send(room);
  } else {
    res.send("room not found");
    //send the room to the client
  }
});
*/

io.engine.on(
  "connection_error",
  (err: { req: any; code: any; message: any; context: any }) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  }
);

http.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});