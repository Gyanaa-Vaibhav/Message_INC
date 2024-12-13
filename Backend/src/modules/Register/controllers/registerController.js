import {registerUser} from "../model/registerModel.js";

export function renderRegister(req, res) {
    // TODO need to redirect to /register
    res.end()
}

export async function handelRegister(req,res,next){
    try{
        console.log("Body",req.body);
        const {username,email,password} = req.body;
        const result = await registerUser(username,email,password);

        if(result.success){
            return res.json({...result});
        }

        return res.json({...result});

    }catch (error){
        next(error);
    }

}