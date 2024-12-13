import {Router} from "express";
import {validate, validateLogin} from "../../../shared/index.js";
import {handelRegister, renderRegister} from "../controllers/registerController.js";

export const registerRoute = Router();

registerRoute.get("/", renderRegister);

registerRoute.post("/",
    validateLogin,
    validate,
    handelRegister
);