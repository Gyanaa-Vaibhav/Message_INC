import {Router} from "express";
import {validate,validateLogin} from "../../../shared/index.js";
import {renderLogin,handleLogin} from "../controllers/loginController.js";

export const loginRoute = Router();

loginRoute.get("/", renderLogin);

loginRoute.post("/",
    validateLogin,
    validate,
    handleLogin
)