import { Message, MessageFactory,MessageTypes } from "./Message.js";

document.addEventListener('DOMContentLoaded', () => {
    
});

class ReconnectingWebSocket{

    reconnectTimeoutInSeconds:number
    webSocketServerAddress:string
    socket:WebSocket
    onOpen:CallableFunction
    constructor(webSocketServerAddress,onOpen=(ws)=>{},reconnectTimeoutInSeconds = 10){
        this.webSocketServerAddress = webSocketServerAddress
        this.reconnectTimeoutInSeconds = reconnectTimeoutInSeconds
        this.connectToWebSocketServer()
        this.onOpen = onOpen
    }

    public sendMessage(message:Message){
        let stringy_message = JSON.stringify(message)
        this.socket.send(stringy_message)
    }
    connectToWebSocketServer = () => {
    
        if(this.socket!=null && this.socket.readyState == this.socket.CLOSING){
            return
        }
        console.log('Trying to connect to server');
    
        if (this.socket == null || this.socket.readyState == this.socket.CLOSED) {
            this.socket = new WebSocket(this.webSocketServerAddress);
    
            this.socket.addEventListener('open', () => {
                console.log('Connected to WS Server');
                this.onOpen(this)
            });
            this.socket.addEventListener('close', () => {
                document.getElementById('wsMessageText').innerHTML = 'Connection got Terminated';
                setTimeout(this.connectToWebSocketServer, this.reconnectTimeoutInSeconds * 1000);
            });
            this.socket.addEventListener('message', (message) => {
                if(message.data.split(" ")[0] == "Status"){
                    
                    let sign = document.getElementById("sign")
                    if(message.data.split(" ")[1] == 1){
    
                        sign.innerHTML="BITTE   EINTRETEN";
                        sign.style.backgroundColor = 'green';
                    }
                    else{
                        sign.innerHTML="BITTE   WARTEN";
                        sign.style.backgroundColor = '#b534d8';
                    }
                }
                document.getElementById('wsMessageText').innerHTML = message.data;
                console.log(message.data);
            });
        }
    };
}


export default ReconnectingWebSocket

