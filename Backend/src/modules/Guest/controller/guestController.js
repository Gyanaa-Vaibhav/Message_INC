// DONE: Implement guest login
import {generateAccessToken} from "../../../shared/index.js";
import { v4  } from 'uuid';
import path from "node:path";
import {htmlDir} from "../../../app.js";


export function renderGuest(req,res){
    res.sendFile(path.join(htmlDir, 'index.html'));
}

// Handle guest login
export function handelGuest(req, res,next) {
    try{
        console.log(req.params)
        const uniqueId = v4();
        const username =  `${req.params.name}_${uniqueId.split('-')[2]}_${uniqueId.split('-')[0]}_${uniqueId.split('-')[1]}_${uniqueId.split('-')[3]}_${uniqueId.split('-')[4]}`
        console.log(username)
        const accessToken = generateAccessToken({
            username : username,
            email: 'guest@email.com'
        })
        return res.json({
            success: true,
            accessToken,
        });

    }catch (error) {
        next(error)
    }
}

