import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
    author: string;
    text: string;
    room: string;
}

interface ChatState {
    messages: Record<string, Message[]>;
    currentRoom: string;
}

const initialState: ChatState = {
    messages: {},
    currentRoom: "General",
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        sendMessage: (state, action: PayloadAction<Message>) => {
            const { room } = action.payload;
            if (!state.messages[room]) state.messages[room] = [];
            state.messages[room].push(action.payload);
        },
        receiveMessage: (state, action: PayloadAction<Message>) => {
            const { room } = action.payload;
            if (!state.messages[room]) state.messages[room] = [];
            state.messages[room].push(action.payload);
        },
        setCurrentRoom: (state, action: PayloadAction<string>) => {
            state.currentRoom = action.payload;
        },
    },
});

export const { sendMessage, receiveMessage, setCurrentRoom } = chatSlice.actions;
export default chatSlice.reducer;

