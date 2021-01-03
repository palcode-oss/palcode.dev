import { ClientMessage, encode } from 'palcode-sockets';

export default function sendSerializedMessage(
    socket: WebSocket,
    message: ClientMessage
) {
    if (socket.readyState !== WebSocket.OPEN) {
        return;
    }

    const encodedMessage = encode(message);
    try {
        socket.send(encodedMessage);
    } catch (e) {}
}
