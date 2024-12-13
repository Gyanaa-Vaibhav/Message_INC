import * as loginModel from '../models/loginModel.js';
import {generateAccessToken, generateRefreshToken} from "../../../shared/index.js";

// Render Login Page
export function renderLogin(req, res) {
    res.send('Login');
}

// Handle Login
export async function handleLogin(req, res,next) {
    try{
        const {email,password} = req.body;
        const result = await loginModel.handleLogin(email,password);

        const accessToken = generateAccessToken({
            username : result.username,
            email
        })

        const refreshToken = generateRefreshToken({
            username : result.username,
            email
        })


        if(result.success){
            res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                // TODO SET TO TRUE AS HTTPS not required in development
                secure: true,
                sameSite: 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            return res.json({
                success: true,
                accessToken,
                refreshToken
            });
        }

        res.status(401).json({
            success: false,
            message:'Invalid Email or Password'
        });

    }catch (error) {
        next(error)
    }
}