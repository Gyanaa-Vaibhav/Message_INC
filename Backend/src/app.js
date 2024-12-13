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
        origin: 'http://62.72.59.39:5172',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const PORT = 6969;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(rateLimiter)
app.use(cors({
    origin: 'http://62.72.59.39:5172',
    credentials: true,
}));
app.use(helmet());
app.use(cookieParser())
app.use(express.json());

// Unprotected Routes
// Login Route
app.use('/login',loginRoute)

// Register Route
app.use('/register',registerRoute)

// Guest Route
app.use('/guest',guestRoute)

// Refresh Token
app.post('/refreshToken',refreshToken)


// Protected Routes

// Socket Validator
io.use(socketValidator)

// JWT Token Validator
app.use(jwtTokenValidator)

// Get Current User
app.get("/current_user", getCurrentUser);

// Chat Route
app.get('/chat',(req,res)=>{
    res.json({"message":"Hello"})
})

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
        console.log('Value:', value);
}

redisTest();

// Listening to Port
server.listen(PORT,()=>{
    console.log(`Listening to Port ${PORT}`)
})
