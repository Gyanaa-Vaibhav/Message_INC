import { io } from 'socket.io-client';
import { verifyOrRefreshToken } from '../../../shared/index.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
// TODO Change 2
const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/chat' : '/chat';

let socket = null;

export const getSocket = async () => {
    if (socket && socket.connected) {
        return socket;
    }

    let token = localStorage.getItem('accessToken');

    const isExpired = () => {
        try {
            const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            return Date.now() >= exp * 1000;
        } catch (error) {
            console.error('Invalid token:', error);
            return true;
        }
    };

    if (isExpired()) {
        console.warn('Token expired. Attempting to refresh...');
        // TODO Change 1
        token = await verifyOrRefreshToken(url);
        if (!token) {
            console.error('Unable to refresh token. Redirecting to login...');
            window.location.href = '/login';
            return null;
        }
        localStorage.setItem('accessToken', token);
    }

    // Initialize the socket connection
    socket = io(SOCKET_URL, {
        path: '/socket.io',
        auth: { token },
        transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
        // console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        // console.log('Socket disconnected:', reason);
    });

    socket.on('tokenExpired', async () => {
        console.warn('Token expired during session. Attempting to refresh...');
        // TODO Change 3
        const newToken = await verifyOrRefreshToken(url);
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
