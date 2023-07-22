import { Message, MessageFactory, MessageTypes } from './Message.js';

class ReconnectingWebSocket {
    reconnectTimeoutInSeconds: number;
    webSocketServerAddress: string;
    socket: WebSocket;
    onOpen: CallableFunction;
    onMessage: CallableFunction;
    onClose: CallableFunction;
    constructor(webSocketServerAddress, onOpen = (ws) => {}, onMessage = (msg) => {},onClose = (ws)=>{}, reconnectTimeoutInSeconds = 10) {
        this.webSocketServerAddress = webSocketServerAddress;
        this.reconnectTimeoutInSeconds = reconnectTimeoutInSeconds;
        this.connectToWebSocketServer();
        this.onOpen = onOpen;
        this.onMessage = onMessage;
        this.onClose = onClose
    }

    public sendMessage(message: Message) {
        let stringy_message = JSON.stringify(message);
        this.socket.send(stringy_message);
    }
    connectToWebSocketServer = () => {
        if (this.socket != null && this.socket.readyState == this.socket.CLOSING) {
            return;
        }
        console.log('Trying to connect to server');

        if (this.socket == null || this.socket.readyState == this.socket.CLOSED) {
            this.socket = new WebSocket(this.webSocketServerAddress);

            this.socket.addEventListener('open', () => {
                console.log('Connected to WS Server');
                this.onOpen(this);
            });
            this.socket.addEventListener('close', () => {
                this.onClose()
                setTimeout(this.connectToWebSocketServer, this.reconnectTimeoutInSeconds * 1000);
            });
            this.socket.addEventListener('message', (message) => {
                this.onMessage(message);
            });
        }
    };
}

export default ReconnectingWebSocket;
