import { put, race, take, takeLatest } from "redux-saga/effects";

export interface Message {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    room: string;
}

export interface ChatState {
    messages: { [room: string]: Message[] };
    isConnected: boolean;
}

const WEBSOCKET_CONNECT = "chat/WEBSOCKET_CONNECT";
const WEBSOCKET_CONNECTED = "chat/WEBSOCKET_CONNECTED";
const MESSAGE_SEND = "chat/MESSAGE_SEND";
const MESSAGE_RECEIVE = "chat/MESSAGE_RECEIVE";

export const chatActions = {
    connectWebSocket: () => ({
        type: WEBSOCKET_CONNECT as typeof WEBSOCKET_CONNECT
    }),
    webSocketConnected: () => ({
        type: WEBSOCKET_CONNECTED as typeof WEBSOCKET_CONNECTED
    }),
    sendMessage: (message: Omit<Message, "id" | "timestamp">) => ({
        type: MESSAGE_SEND as typeof MESSAGE_SEND,
        payload: message
    }),
    receiveMessage: (message: Message) => ({
        type: MESSAGE_RECEIVE as typeof MESSAGE_RECEIVE,
        payload: message
    })
};

type ChatAction =
    | ReturnType<typeof chatActions.connectWebSocket>
    | ReturnType<typeof chatActions.webSocketConnected>
    | ReturnType<typeof chatActions.sendMessage>
    | ReturnType<typeof chatActions.receiveMessage>;

const initialState: ChatState = {
    messages: {
        "General": [
            { id: "1", author: "Alice", text: "Hi!", timestamp: new Date().toISOString(), room: "General" },
            { id: "2", author: "Bob", text: "Hello!", timestamp: new Date().toISOString(), room: "General" }
        ],
        "Random": []
    },
    isConnected: false
};

export function chatReducer(state = initialState, action: ChatAction): ChatState {
    switch (action.type) {
        case WEBSOCKET_CONNECTED:
            return { ...state, isConnected: true };

        case MESSAGE_RECEIVE: {
            const message = (action as ReturnType<typeof chatActions.receiveMessage>).payload;
            const roomMessages = state.messages[message.room] || [];

            return {
                ...state,
                messages: {
                    ...state.messages,
                    [message.room]: [...roomMessages, message]
                }
            };
        }
        default:
            return state;
    }
}

let socket: WebSocket | null = null;

function* webSocketSaga() {
    try {
        socket = new WebSocket("wss://ws.postman-echo.com/raw");
        yield new Promise<void>((resolve) => {
            socket!.onopen = () => resolve();
        });
        yield put(chatActions.webSocketConnected());
        while (true) {
            const { sendAction, serverMessage } = yield race({
                sendAction: take(MESSAGE_SEND),
                serverMessage: new Promise(resolve => {
                    const handler = (event: MessageEvent) => resolve(event.data);
                    socket!.addEventListener("message", handler);
                    return () => socket!.removeEventListener("message", handler);
                })
            });

            if (sendAction) {
                const messageData = (sendAction as ReturnType<typeof chatActions.sendMessage>).payload;
                const message: Message = {
                    ...messageData,
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString()
                };
                socket.send(message.text);
                yield put(chatActions.receiveMessage(message));

                const { echo } = yield race({
                    echo: new Promise<string>(resolve => {
                        const echoHandler = (event: MessageEvent) => {
                            resolve(event.data);
                            socket!.removeEventListener("message", echoHandler);
                        };
                        socket!.addEventListener("message", echoHandler);
                    }),
                    timeout: new Promise(resolve => setTimeout(resolve, 2000))
                });

                if (echo) {
                    const echoMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        author: "Echo Server",
                        text: echo,
                        timestamp: new Date().toISOString(),
                        room: messageData.room
                    };
                    yield put(chatActions.receiveMessage(echoMessage));
                }
            }

            if (serverMessage) {
                const echoMessage: Message = {
                    id: Date.now().toString(),
                    author: "Echo Server",
                    text: `Server: ${serverMessage}`,
                    timestamp: new Date().toISOString(),
                    room: "General"
                };
                yield put(chatActions.receiveMessage(echoMessage));
            }
        }

    } catch (error) {
        console.log("Connection error:", error);
    }
}

export function* chatSaga() {
    yield takeLatest(WEBSOCKET_CONNECT, webSocketSaga);
}

export const chatSelectors = {
    messagesByRoom: (state: { chat: ChatState }) => state.chat.messages,
    isConnected: (state: { chat: ChatState }) => state.chat.isConnected
};