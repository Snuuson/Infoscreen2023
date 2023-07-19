
interface Message {
    type: MessageTypes;
    value: string;
    tableId: number;
}
class Message implements Message {
    type: MessageTypes;
    value: string;
    tableId: number;

    constructor(type: MessageTypes, value: string) {
        this.type = type;
        this.value = value;
    }
}

enum MessageTypes {
    status,
    table,
    holiday
}

class MessageFactory {
    public static CreateStatusMessage = (json_string) => {
        return new Message(MessageTypes.status, json_string);
    };
    public static CreateTableMessage = (tableId, json_string) => {
        let message = new Message(MessageTypes.table, json_string);
        message.tableId = tableId;
        return message;
    };

    public static CreateHolidayMessage = (json_string) => {
        return new Message(MessageTypes.holiday, json_string);
    };
}

export { MessageFactory, MessageTypes, Message };
