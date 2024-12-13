import jwt from "jsonwebtoken";

export default function socketValidator(socket, next) {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: Token is missing'));
    }
    try {
        socket.user = jwt.verify(token, process.env.ACCESS_SECRET);
        next();

    } catch (err) {

        if (err.name === 'TokenExpiredError') {

            socket.emit('tokenExpired', {
                message: 'Token expired. Please refresh your session.',
            });

            setTimeout(() => socket.disconnect(), 5000);

            return next(new Error('Authentication error: Token expired'));
        }
        return next(new Error('Authentication error: Invalid token'));
    }
}