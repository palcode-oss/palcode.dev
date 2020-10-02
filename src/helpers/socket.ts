import openSocket from 'socket.io-client';

export function useSocket() {
    if (!process.env.REACT_APP_SOCKET) {
        throw new TypeError('Socket URL is undefined');
    }

    return openSocket(process.env.REACT_APP_SOCKET);
}
