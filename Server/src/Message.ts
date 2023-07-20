
interface Message {
    type: MessageTypes;
    value: any;
}
class Message implements Message {
    type: MessageTypes;
    value: any;

    constructor(type: MessageTypes, value: any) {
        this.type = type;
        this.value = value;
    }
}

enum MessageTypes {
    status,
    updateView
}

class MessageFactory {
    public static CreateStatusMessage = (status:boolean) => {
        return new Message(MessageTypes.status, status);
    };
    public static CreateUpdateMessage = () => {
        return new Message(MessageTypes.updateView,"Please Update View")
    }   

    
}

export { MessageFactory, MessageTypes, Message };
