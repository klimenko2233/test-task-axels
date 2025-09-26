import { takeEvery, call, put, fork } from "redux-saga/effects";
import { eventChannel, type EventChannel, END } from "redux-saga";
import { sendMessage, receiveMessage, type Message } from "./chatSlice";

// Канал WebSocket
function createSocketChannel(socket: WebSocket): EventChannel<Message> {
    return eventChannel<Message>((emit) => {
        socket.onmessage = (event) => {
            try {
                const data: Message = JSON.parse(event.data);
                emit(data);
            } catch {
                console.error("Invalid message format");
            }
        };

        socket.onerror = (err) => {
            console.error("WebSocket error", err);
            emit(END);
        };

        return () => socket.close();
    });
}

// Следим за отправкой сообщений
function* watchSendMessage(socket: WebSocket) {
    yield takeEvery(sendMessage.type, function* (action: ReturnType<typeof sendMessage>) {
        socket.send(JSON.stringify(action.payload));
    });
}

// Следим за входящими сообщениями
function* watchReceiveMessages(socket: WebSocket) {
    const chan: EventChannel<Message> = yield call(createSocketChannel, socket);

    while (true) {
        const message: Message | typeof END = yield call(() => new Promise<Message | typeof END>((resolve) => chan.take(resolve)));

        if (message === END) break;
        yield put(receiveMessage(message as Message));
    }
}

// Основная сага чата
export function* chatSaga() {
    const socket = new WebSocket("wss://ws.postman-echo.com/raw");
    yield fork(watchReceiveMessages, socket);
    yield fork(watchSendMessage, socket);
}
