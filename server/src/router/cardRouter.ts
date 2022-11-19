import express from "express";
import type { Router } from "express";
import { carre } from "../controller/cardController"

export function buildRoutes() {
    const router: Router = express.Router();

    router.route('/card/:id').get(carre);

    

    return router;
}

