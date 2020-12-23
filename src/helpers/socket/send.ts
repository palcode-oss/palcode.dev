import { encode } from 'js-base64';

export default function sendSerializedMessage(
    socket: WebSocket,
    message: Object
) {
    const stringJSON = JSON.stringify(message);
    const base64 = encode(stringJSON);
    socket.send(base64);
}
