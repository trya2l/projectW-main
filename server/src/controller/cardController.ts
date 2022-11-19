import type { Request, Response } from "express";
import { Carte } from "../models/carte.model";

function carre(nb: any): number {
  return nb * nb;
}

function test(req: Request, res: Response) {
  /*const carte = new Carte(
    req.params.valeur,
    req.params.number,
    req.params.url,
    req.params.couleur
  );

  res.send(carte.);*/
}

function carreAPI(req: Request, res: Response) {
  console.log("api triggered");

  res.status(200).json({
    status: "success",
    data: carre(req.params.id),
  });
}

export { carreAPI as carre };
