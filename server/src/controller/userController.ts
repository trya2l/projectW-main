import type { Request, Response } from "express";
import { Joueur } from "../models/joueur.model";
//listes des users
const users: Joueur[] = [];

//get the list of users
function getUsers(req: Request, res: Response) {
    //send the list of users to the client
    res.send(users);
}


// api function post request to create a new user
function createUser(req: Request, res: Response) {
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
    }

// api function post request to get a user
function getUser(req: Request, res: Response) {
    //get the user id
    const userId = req.body.userId;
    //get the user
    const user = users.find((user) => user.getId() == userId);
    //send the user to the client
    res.send(user);
    }


// export the functions

export { createUser, getUser };


