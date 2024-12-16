import {registerUser} from "../model/registerModel.js";
import path from "node:path";
import {htmlDir} from "../../../app.js";

export function renderRegister(req, res) {
    res.sendFile(path.join(htmlDir, 'index.html'));
}

export async function handelRegister(req,res,next){
    try{
        console.log("Body",req.body);
        const {username,email,password} = req.body;
        const result = await registerUser(username,email,password);

        if(result.success){
            return res.status(201).json({...result});
        }

        return res.status(409).json({...result});

    }catch (error){
        next(error);
    }

}