import { Message, MessageFactory, MessageTypes } from './Message.js';

class ReconnectingWebSocket {
    reconnectTimeoutInSeconds: number;
    webSocketServerAddress: string;
    socket: WebSocket;
    onOpen: CallableFunction;
    onMessage: CallableFunction;
    onClose: CallableFunction;
    missedHeartbeats = 0;
    constructor(webSocketServerAddress, onOpen = (ws) => {}, onMessage = (msg) => {}, onClose = (ws) => {}, reconnectTimeoutInSeconds = 10) {
        this.webSocketServerAddress = webSocketServerAddress;
        this.reconnectTimeoutInSeconds = reconnectTimeoutInSeconds;
        this.connectToWebSocketServer();
        this.onOpen = onOpen;
        this.onMessage = onMessage;
        this.onClose = onClose;
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
                this.sendHeartbeatSignals();
            });
            this.socket.addEventListener('close', () => {
                this.onClose();
                setTimeout(this.connectToWebSocketServer, this.reconnectTimeoutInSeconds * 1000);
            });
            this.socket.addEventListener('message', (message) => {
                let msg = <Message>JSON.parse(message.data)
                if(msg.type === MessageTypes.heartbeat){
                    console.log("Recieved heartbeat message")
                    this.missedHeartbeats = 0
                }
                this.onMessage(message);
            });
        }
    };
    sendHeartbeatSignals = () => {
        setInterval(() => {
            if(this.missedHeartbeats >= 3){
                this.socket.close()
                this.socket = null
            }
            this.socket.send(JSON.stringify(MessageFactory.CreateHeartbeatMessage()));
            this.missedHeartbeats++;
            console.log('Sending heartbeat message');
        }, 1000);
    };
}

export default ReconnectingWebSocket;
