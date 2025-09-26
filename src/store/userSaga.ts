import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "./userSlice";
import type { UserCredo } from "../App.tsx";

function* handleLogin(action: ReturnType<typeof loginRequest>) {
    try {
        const { name, password } = action.payload;
        const user: UserCredo = yield call(connectAndLogin, { name, password });
        yield put(loginSuccess(user));
    } catch (error) {
        if (error instanceof Error) {
            yield put(loginFailure(error.message));
        } else {
            yield put(loginFailure("Unknown error"));
        }
    }
}

function connectAndLogin({ name, password }: { name: string; password: string }) {
    return new Promise<UserCredo>((resolve, reject) => {
        const ws = new WebSocket("wss://ws.postman-echo.com/raw");

        ws.onopen = () => {
            ws.send(JSON.stringify({ name, password }));
        };

        ws.onmessage = (event) => {
            try {
                const data: UserCredo = JSON.parse(event.data);
                resolve({ name: data.name, password: data.password });
            } catch {
                reject(new Error("Invalid server response"));
            } finally {
                ws.close();
            }
        };

        ws.onerror = () => reject(new Error("WebSocket error"));
    });
}

export default function* userWatcherSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
}