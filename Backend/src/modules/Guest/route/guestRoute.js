import {Router} from "express";
import {handelGuest, renderGuest} from "../controller/guestController.js";

export const guestRoute = Router();

guestRoute.get('/',renderGuest);
guestRoute.get('/:name',handelGuest)

