import { io } from 'socket.io-client';
import { verifyOrRefreshToken } from '../../../shared/index.js';

const SOCKET_URL = 'http://62.72.59.39:6969';

let socket = null;

export const getSocket = async () => {
    if (socket && socket.connected) {
        return socket;
    }

    let token = localStorage.getItem('accessToken');

    const isExpired = () => {
        const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        return Date.now() >= exp * 1000;
    };

    if (isExpired()) {
        console.warn('Token expired. Attempting to refresh...');
        token = await verifyOrRefreshToken('http://62.72.59.39:6969/chat');
        if (!token) {
            console.error('Unable to refresh token. Redirecting to login...');
            window.location.href = '/login';
            return null;
        }
        localStorage.setItem('accessToken', token);
    }

    // Initialize the socket connection
    socket = io(SOCKET_URL, { auth: { token } });

    socket.on('connect', () => {
        // console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        // console.log('Socket disconnected:', reason);
    });

    socket.on('tokenExpired', async () => {
        console.warn('Token expired during session. Attempting to refresh...');
        const newToken = await verifyOrRefreshToken('http://62.72.59.39:6969/chat');
        if (newToken) {
            socket.auth.token = newToken;
            socket.connect();
        } else {
            console.error('Failed to refresh token. Redirecting to login...');
            window.location.href = '/login';
        }
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...');
        socket.disconnect();
        socket = null;
    }
};
