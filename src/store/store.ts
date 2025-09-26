import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import userWatcherSaga from "./userSaga";
import { all } from "redux-saga/effects";
import { chatSaga } from "./chatSaga.ts";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

function* rootSaga() {
    yield all([userWatcherSaga(), chatSaga()]);
}

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
