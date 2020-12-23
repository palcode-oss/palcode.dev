import getEnvVariable from '../getEnv';

type Dispose = () => void;
export default function connectToSocket(
    setSocket: (socket: WebSocket) => void,
): Dispose {
    const socketUrl = getEnvVariable('RUNNER');
    if (!socketUrl) {
        throw new TypeError('Xterm socket URL is undefined');
    }
    const socket = new WebSocket(socketUrl);
    setSocket(socket);

    const reconnect = () => {
        connectToSocket(setSocket);
    }

    socket.addEventListener('close', reconnect);
    return () => {
        socket.removeEventListener('close', reconnect);
        socket.close();
    }
}
