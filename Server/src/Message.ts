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
    updateView,
    heartbeat
}

class MessageFactory {
    public static CreateStatusMessage = (status: boolean) => {
        return new Message(MessageTypes.status, status);
    };
    public static CreateUpdateMessage = () => {
        return new Message(MessageTypes.updateView, 'Please Update View');
    };
    public static CreateHeartbeatMessage = () => {
        return new Message(MessageTypes.heartbeat, 1);
    };
}

export { MessageFactory, MessageTypes, Message };
