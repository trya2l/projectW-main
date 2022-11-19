import express from "express";
import type { Router } from "express";
import { carre } from "../controller/cardController";
import { createRoom, getRoom, getRooms, cleanRooms, jouerCarte, piocher } from "../controller/roomController";
import { getPartie } from "../controller/partieController";

export function buildRoutes() {
  const router: Router = express.Router();

  router.route("/card/:id").get(carre);

  //room

  router.route("/room/createRoom").get(createRoom);
  router.route("/room/createRoom").post(createRoom);
  router.route("/room/getRooms").get(getRooms);
  router.route("/room/getRoom").post(getRoom);
  router.route("/room/cleanRooms").get(cleanRooms);
  router.route("/room/jouerCarte").post(jouerCarte);
  router.route("/room/piocher").post(piocher);

  //partie
  router.route("/partie/getPartie/:id").get(getPartie);

  return router;
}
