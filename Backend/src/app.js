import express from "express";
import helmet from 'helmet'
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as path from "node:path";
import * as url from 'node:url';
import {Server} from "socket.io";
import * as http from "node:http";
import {
    loginRoute,
    registerRoute,
    guestRoute
} from "./modules/index.js";
import {
    rateLimiter,
    refreshToken,
    socketValidator,
    jwtTokenValidator,
    getCurrentUser,
    globalErrorHandler,
    storeToRedis,
    getFromRedis,
    setExpiry,
    getMessages,
    addMessage,
    deleteOldMessages
} from "./shared/index.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 9999;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const htmlDir = path.join(__dirname,'..','..', '..','html','Message_INC');

// Server Configuration
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.DEPLOYMENT_IP,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Trust Proxy
app.set('trust proxy', 1);

// Middleware
app.use(rateLimiter)
app.use(cors({
    origin: process.env.DEPLOYMENT_IP,
    credentials: true,
}));
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

// Static Files
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
    res.sendFile(path.join(htmlDir, 'index.html'));
})

// Protected Routes
// Socket Validator
io.use(socketValidator)

// JWT Token Validator
app.use(jwtTokenValidator)

// Get Current User
app.get("/current_user", getCurrentUser);

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);


    socket.on('joinRoom', async (room) => {
        socket.join(room);
        await deleteOldMessages();

        if(room !== 'general'){
            await setExpiry(room)
        }

        const fromRedis = await getFromRedis(room);

        if (fromRedis.length === 0) {
            console.log('No redis found');
            try{
                const messages = await getMessages(room);
                console.log(messages)

                // Map messages into the desired format
                const formattedMessages = messages.map((msg) => ({
                    message: msg.message_content,
                    username: msg.sender_name,
                    time: msg.sent_id,
                }));

                const redisPromises = formattedMessages.map((message) =>
                    storeToRedis(room, JSON.stringify(message))
                );

                await Promise.all(redisPromises);

            }catch(err){
                console.log('No data found')
            }

        }

        const roomMessages = await getFromRedis(room);

        io.to(room).emit('chatHistory',roomMessages);

        io.to(room).emit('userJoined', {
            username: socket.user.username,
            time: new Date().toISOString(),
        });
    });

    socket.on('sendMessage',async ({ room, message })=>{
        const username = socket.user.username;
        const messageData = {
            message: message,
            username: username,
            time: new Date().toISOString(),
        };

        await storeToRedis(room,JSON.stringify(messageData));
        await addMessage(username,room,message);

        io.to(room).emit('newMessage',messageData);
    })

    // User Typing
    socket.on('typing', ({room}) => {
        io.to(room).emit('userTyping', {
            username:socket.user.username,
            message: 'is typing...'
        });
    });


    socket.on('stopTyping', ({room}) => {
        io.to(room).emit('userStoppedTyping');
    });

    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
            if (room !== socket.id) {
                socket.to(room).emit('userDisconnected', socket.user.username);
            }
        });
    });

    // Disconnect User
    // const disconnectedUser = (user)=>{
    //     io.emit('userDisconnected',user)
    // };

    // socket.on('disconnect', () => {
    //     disconnectedUser(socket.user.username);
    // });

});

// Global Error Handler
app.use(globalErrorHandler)

// Listening to Port
server.listen(PORT,()=>{
    console.log(`Listening to Port ${PORT}`)
})
