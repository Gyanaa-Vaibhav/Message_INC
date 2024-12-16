import {Router} from "express";
import {validate, validateRegister} from "../../../shared/index.js";
import {handelRegister, renderRegister} from "../controllers/registerController.js";

export const registerRoute = Router();

registerRoute.get("/", renderRegister);

registerRoute.post("/",
    validateRegister,
    validate,
    handelRegister
);