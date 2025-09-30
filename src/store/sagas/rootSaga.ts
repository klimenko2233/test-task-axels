import { all } from "redux-saga/effects";
import { authSaga } from "../ducks/auth.duck.ts";
import { chatSaga } from "../ducks/chat.duck.ts";

export default function* rootSaga() {
    yield all([
        authSaga(),
        chatSaga()
    ]);
}