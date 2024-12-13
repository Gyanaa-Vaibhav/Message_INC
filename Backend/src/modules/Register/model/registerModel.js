import * as db from '../database/query.js';
import bcrypt from 'bcrypt';
import {getUser} from "../../../shared/index.js";

export async function registerUser(username,email,password) {
    try {
        console.log("registerUser",username,email,password);
        const userExists = await getUser(email);
        const hashedPassword = await bcrypt.hash(password, 10);

        if (userExists) {
            return {
                success: false,
                message: "User already exists"
            };
        }

        await db.registerUser(username,email,hashedPassword);
        return {
            success: true,
            message: "User registered successfully"
        }

    } catch (error) {
        console.error(`Error in registerUser: ${error.message}`);
        throw new Error(error.message);
    }
}