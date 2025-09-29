import { combineReducers } from "redux";
import { authReducer } from "./auth.duck.ts";
import { chatReducer } from "./chat.duck.ts";
import { roomsReducer } from "./rooms.duck.ts";


const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    rooms: roomsReducer
});

export default rootReducer;