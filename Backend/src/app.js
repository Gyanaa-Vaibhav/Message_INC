import express from "express";
import helmet from 'helmet'
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as path from "node:path";
import * as url from 'node:url';
import {Server} from "socket.io";
import * as http from "node:http";
import Redis from "ioredis";
import {loginRoute,registerRoute,guestRoute} from "./modules/index.js";
import {
    rateLimiter,
    refreshToken,
    socketValidator,
    jwtTokenValidator,
    getCurrentUser,
    globalErrorHandler,
} from "./shared/index.js";
dotenv.config();

const redis = new Redis();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.DEPLOYMENT_IP,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const PORT = process.env.SERVER_PORT || 9999;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const htmlDir = path.join(__dirname,'..','..', 'html');

app.set('trust proxy', 1);

// Middleware
app.use(rateLimiter)
app.use(cors({
    origin: process.env.DEPLOYMENT_IP,
    credentials: true,
}));
app.use(helmet());
app.use(cookieParser())
app.use(express.json());

// Middleware
app.use(rateLimiter)

app.use(cors({
    origin: process.env.DEPLOYMENT_IP,
    methods: ['GET', 'POST', 'OPTIONS'],    // Explicitly allow these methods
    allowedHeaders: ['Content-Type'],
    credentials: true, // Allow cookie
}));

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: [
                    "'self'",
                    "https://gyanaavaibhav.in",
                    "wss://gyanaavaibhav.in",
                ],
            },
        },
    })
);

app.use(cookieParser())
app.use(express.json());

app.use(express.static(path.join(htmlDir)));

// Unprotected Routes
// Login Route
app.use('/login',loginRoute)

// Register Route
app.use('/register',registerRoute)

// Guest Route
app.use('/guest',guestRoute)

// Refresh Token
app.post('/refreshToken',refreshToken)

app.get('/chat',(req,res)=>{
    console.log(req.user);
    res.sendFile(path.join(htmlDir, 'index.html'));
})

// Protected Routes
// Socket Validator
io.use(socketValidator)

// JWT Token Validator
app.use(jwtTokenValidator)

// Get Current User
app.get("/current_user", getCurrentUser);

// Chat Route
app.get('/chat/:name',(req,res)=>{
    res.json({"message":"Hello"})
})

// Socket.io Connection
io.on('connection', (socket) => {

    io.emit('userJoined', {
        username: socket.user.username,
        time: new Date().toISOString(),
    });

    socket.on('sendMessage', (message) => {
        console.log(message)
        io.emit('newMessage', {
            message: message,
            username: socket.user.username,
            time: new Date().toISOString()});
    });


    // User Typing
    socket.on('typing', () => {
        io.emit('userTyping', {
            username:socket.user.username,
            message: 'is typing...'
        });
    });


    socket.on('stopTyping', () => {
        io.emit('userStoppedTyping');
    });


    // Disconnect User
    const disconnectedUser = (user)=>{
        io.emit('userDisconnected',user)
    };

    socket.on('disconnect', () => {
        disconnectedUser(socket.user.username);
    });

});

// Global Error Handler
app.use(globalErrorHandler)


async function redisTest() {
        await redis.set('key', 'value');

        const value = await redis.get('key');
}

// Listening to Port
server.listen(PORT,()=>{
    console.log(`Listening to Port ${PORT}`)
})
