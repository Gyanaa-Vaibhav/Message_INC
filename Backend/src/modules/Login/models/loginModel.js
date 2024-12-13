import bcrypt from "bcrypt";
import {getUser} from "../../../shared/index.js";

async function handleLogin(email, password) {
    try{
        const userExists = await getUser(email)

        if (userExists) {
            if(await bcrypt.compare(password, userExists.password)){
                return {
                    success:true,
                    username: userExists.name,
                    message:'Login Successfully'
                };
            }
            return {
                success: false,
                message:"Password wrong"
            }
        }

        return {
            success: false,
            error: "User already exists"
        }

    }catch (error){
        console.error(error);
        throw new Error(error);
    }
}

export {handleLogin}