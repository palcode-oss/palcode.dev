import { ClientMessage, encode } from 'palcode-sockets';

export default function sendSerializedMessage(
    socket: WebSocket,
    message: ClientMessage
) {
    const encodedMessage = encode(message);
    socket.send(encodedMessage);
}
